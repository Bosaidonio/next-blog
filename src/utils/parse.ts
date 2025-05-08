/**
 * Represents the parsed value for a 'collapse' annotation.
 */
export interface CollapseAnnotationValue {
  start: number;
  end: number;
}
/**
 * Represents the extracted directive type and its raw value string.
 */
export interface ExtractedAnnotation {
  type: string;
  rawValue: string;
}
/**
 * Represents the parsed value for a 'callout' annotation.
 */
export interface CalloutAnnotationValue {
  regex: string;
  tag?: string;
  message: string;
}


/**
 * Represents a parsed annotation from a Code Hike comment.
 */
export interface CodeHikeAnnotation {
  type: string;
  rawValue: string;
  parsedValue?: CollapseAnnotationValue | CalloutAnnotationValue | string | unknown;
}

/**
 * Represents a single line of code with its associated annotations.
 */
export interface ParsedCodeLine {
  code: string;
  annotations: CodeHikeAnnotation[];
}



/**
 * Parses the raw value string specifically for a 'collapse' annotation.
 * Expected format: (number:number)
 *
 * @param rawValue The raw string value for the collapse annotation (e.g., '(3:5)').
 * @returns A CollapseAnnotationValue object or a default if parsing fails.
 */
function parseCollapseValue(rawValue: string): CollapseAnnotationValue {
  const match = rawValue.match(/^\((\d+):(\d+)\)$/);
  if (match) {
    const start = parseInt(match[1], 10);
    const end = parseInt(match[2], 10);

    if (!isNaN(start) && !isNaN(end) && start >= 1 && end >= 1 && start <= end) {
      return { start, end } satisfies CollapseAnnotationValue;
    } else {
      console.warn(`[parseCollapseValue] Invalid collapse range format or values: "${rawValue}". Expected (number:number) with 1-based positive numbers where start <= end.`);
      return { start: 1, end: 1 } satisfies CollapseAnnotationValue;
    }
  } else {
    console.warn(`[parseCollapseValue] Unexpected collapse value format: "${rawValue}". Expected (number:number).`);
    return { start: 1, end: 1 } satisfies CollapseAnnotationValue;
  }
}

/**
 * Parses the raw value string specifically for a 'callout' annotation.
 * Expected format: [/regex/] #optionalTag message
 *
 * @param rawValue The raw string value for the callout annotation (e.g., '[/amet/] #warning Hi').
 * @returns A CalloutAnnotationValue object or a default if parsing fails.
 */
function parseCalloutValue(rawValue: string): CalloutAnnotationValue {
  const initialMatch = rawValue.match(/^\[(\/.*?\/)\]\s*(.*)$/);
  if (initialMatch) {
    const regex = initialMatch[1];
    const messageWithTag = initialMatch[2];
    const tagMatch = messageWithTag.match(/^#(\w+)\s*(.*)$/);
    if (tagMatch) {
      const tag = tagMatch[1];
      const message = tagMatch[2];
      return { regex, tag, message } satisfies CalloutAnnotationValue;
    } else {
      const message = messageWithTag;
      return { regex, message } satisfies CalloutAnnotationValue;
    }

  } else {
    console.warn(`[parseCalloutValue] Unexpected callout value format: "${rawValue}". Expected [/regex/] #optionalTag message.`);
    return { regex: '', message: rawValue } satisfies CalloutAnnotationValue;
  }
}
/**
 * Extracts the directive type and raw value string from the content following "// !".
 * Handles formats like "collapse(3:5)", "callout[/regex/] message", "fullscreen".
 *
 * @param annotationContentString The string content directly after "// !".
 * @returns An object containing the extracted type and rawValue.
 */
function extractAnnotationTypeAndRawValue(annotationContentString: string): ExtractedAnnotation {
  const directiveMatch = annotationContentString.match(/^(\w+)(.*)$/);

  if (directiveMatch) {
    const type = directiveMatch[1];
    const rawValue = directiveMatch[2].trim();
    return { type, rawValue };
  } else {
    console.warn(`[extractAnnotationTypeAndRawValue] Could not parse directive format: "${annotationContentString}". Treating as type with empty value.`);
    return { type: annotationContentString, rawValue: '' };
  }
}


/**
 * Parses the raw value string of a Code Hike annotation based on its type.
 * Provides structured data for known annotation types like 'collapse' or 'callout'.
 * Returns the raw value for unknown types or types without specific parsing.
 *
 * @param type The annotation type (e.g., 'collapse', 'callout').
 * @param rawValue The raw string value after the type (e.g., '(1:7)', '[/amet/] Hi').
 * @returns A structured object (like {start, end}), the raw value string, or unknown.
 */
function parseAnnotationValue(type: string, rawValue: string): unknown {
  switch (type) {
    case 'collapse': {
      return parseCollapseValue(rawValue);
    }
    case 'callout': {
      return parseCalloutValue(rawValue);
    }
    case 'className': {
      return rawValue;
    }
    default:
      return rawValue;
  }
}

/**
 * Parses a string containing code and Code Hike annotations.
 * Extracts and structures annotation information, including specific parsing for known types.
 * Handles annotation comments (// !...) applying to the next non-comment, non-empty line.
 *
 * @param codeString The input string with code and // ! annotations.
 * @returns An array of ParsedCodeLine objects.
 */
function parseCodeHikeMarkdown(codeString: string): ParsedCodeLine[] {
  const lines = codeString.split('\n');
  const parsedLines: ParsedCodeLine[] = [];
  let pendingAnnotations: CodeHikeAnnotation[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    const annotationMatch = trimmedLine.match(/^\s*\/\/\s*!(.+)/);

    const isRegularComment = trimmedLine.match(/^\s*\/\/[^!]/);

    const isEmptyOrWhitespace = trimmedLine.length === 0;

    if (annotationMatch) {
      const fullAnnotationContent = annotationMatch[1].trim();
      const { type, rawValue } = extractAnnotationTypeAndRawValue(fullAnnotationContent);
      const parsedValue = parseAnnotationValue(type, rawValue);
      pendingAnnotations.push({ type, rawValue, parsedValue });
    } else if (isRegularComment || isEmptyOrWhitespace) {
    } else {
      // 这是一个非注释、非空/非空白的行。视为代码行。
      parsedLines.push({
        code: line,
        annotations: [...pendingAnnotations],
      });
      pendingAnnotations = [];
    }
  }
  return parsedLines;
}
/**
 * Checks if a markdown string contains any Code Hike collapse annotations.
 * Code Hike collapse annotations typically look like "// !collapse" or "// !collapse(range)".
 *
 * @param markdownString The input markdown string.
 * @returns true if a collapse annotation is found, false otherwise.
 */
function containsCollapseAnnotation(markdownString: string): boolean {
  const lines = markdownString.split('\n');
  const collapseRegex = /^\s*\/\/\s*!collapse/;
  for (const line of lines) {
    if (collapseRegex.test(line)) {
      return true;
    }
  }
  return false;
}

export { parseCodeHikeMarkdown, containsCollapseAnnotation };
