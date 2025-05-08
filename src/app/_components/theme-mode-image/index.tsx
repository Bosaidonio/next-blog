
'use client'

import { FC } from 'react'
import Image, { ImageProps } from 'next/image'

type ThemeModeImageProps = Omit<ImageProps, 'src' | 'priority' | 'loading' | 'alt' | 'width' | 'height'> & {
  srcLight: string
  srcDark: string
  alt?: string
  width?: number
  height?: number
}
const ThemeModeImage:FC<ThemeModeImageProps> = (props) => {
  const { srcLight, srcDark,alt, width = 200,height=200 ,...rest } = props
  return (
    <div className="relative">
      <Image
        src={srcLight}
        alt={alt || 'Default light image'}
        width={width}
        height={height}
        {...rest}
        fill={!(width || height)}
        className="block dark:hidden"
      />
      <Image
        src={srcDark}
        alt={alt || 'Default dark image'}
        width={width}
        height={height}
        {...rest}
        fill={!(width || height)}
        className="hidden dark:block"
      />
    </div>
  );
};

export default ThemeModeImage;
