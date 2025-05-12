/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 任务进度信息接口
 */
interface TaskProgress {
  completed: number
  total: number
  remaining: number
  failed: number
}

/**
 * 任务成功回调参数接口
 */
interface TaskSuccessData {
  name: string
  status: 'success'
  result: any
  progress: TaskProgress
}

/**
 * 任务错误回调参数接口
 */
interface TaskErrorData {
  name: string
  error: Error
  progress: TaskProgress
}

/**
 * 任务完成回调参数接口
 */
interface TaskCompleteData {
  total: number
  completed: number
  failed: number
}

/**
 * 任务对象接口
 */
interface Task {
  task: () => Promise<any>
  name: string
}

/**
 * 任务调度器
 * 用于管理和执行爬虫任务，支持并发控制和任务队列管理
 */
function Scheduler(this: Scheduler) {
  this.tasks = [] as Task[]
  this.running = false
  this.maxConcurrent = 10
  this.completedTasks = 0
  this.totalTasks = 0
  this.failedTasks = 0
  this.onProgress = null
  this.onComplete = null
  this.onError = null
  this.pauseBetweenTasks = 1000 // 任务间隔时间(毫秒)
}

// 调度器类型定义
interface Scheduler {
  tasks: Task[]
  running: boolean
  maxConcurrent: number
  completedTasks: number
  totalTasks: number
  failedTasks: number
  onProgress: ((data: TaskSuccessData) => void) | null
  onComplete: ((data: TaskCompleteData) => void) | null
  onError: ((data: TaskErrorData) => void) | null
  pauseBetweenTasks: number

  addTask(task: () => Promise<any>, taskName?: string): Scheduler
  addTasks(tasks: Array<() => Promise<any>>, batchName?: string): Scheduler
  setProgressCallback(callback: (data: TaskSuccessData) => void): Scheduler
  setCompleteCallback(callback: (data: TaskCompleteData) => void): Scheduler
  setErrorCallback(callback: (data: TaskErrorData) => void): Scheduler
  setPauseBetweenTasks(ms: number): Scheduler
  runTasks(): void
}

/**
 * 添加任务到队列
 * @param {Function} task - 要执行的任务函数，必须返回Promise
 * @param {string} taskName - 任务名称，用于日志记录
 */
Scheduler.prototype.addTask = function (this: Scheduler, task: () => Promise<any>, taskName: string = ''): Scheduler {
  this.tasks.push({ task, name: taskName })
  this.totalTasks++

  if (!this.running) {
    this.running = true
    this.runTasks()
  }

  return this // 支持链式调用
}

/**
 * 批量添加任务
 * @param {Array<Function>} tasks - 任务函数数组
 * @param {string} batchName - 批次名称前缀
 */
Scheduler.prototype.addTasks = function (this: Scheduler, tasks: Array<() => Promise<any>>, batchName: string = 'Task'): Scheduler {
  tasks.forEach((task, index) => {
    this.addTask(task, `${batchName} ${index + 1}`)
  })

  return this // 支持链式调用
}

/**
 * 设置任务进度回调
 * @param {Function} callback - 进度回调函数
 */
Scheduler.prototype.setProgressCallback = function (this: Scheduler, callback: (data: TaskSuccessData) => void): Scheduler {
  this.onProgress = callback
  return this
}

/**
 * 设置所有任务完成回调
 * @param {Function} callback - 完成回调函数
 */
Scheduler.prototype.setCompleteCallback = function (this: Scheduler, callback: (data: TaskCompleteData) => void): Scheduler {
  this.onComplete = callback
  return this
}

/**
 * 设置任务错误回调
 * @param {Function} callback - 错误回调函数
 */
Scheduler.prototype.setErrorCallback = function (this: Scheduler, callback: (data: TaskErrorData) => void): Scheduler {
  this.onError = callback
  return this
}

/**
 * 设置任务间隔时间
 * @param {number} ms - 间隔毫秒数
 */
Scheduler.prototype.setPauseBetweenTasks = function (this: Scheduler, ms: number): Scheduler {
  this.pauseBetweenTasks = ms
  return this
}

/**
 * 执行任务队列
 * 会自动控制并发数量，并在所有任务完成后触发完成回调
 */
Scheduler.prototype.runTasks = function (this: Scheduler): void {
  if (this.tasks.length === 0) {
    this.running = false
    if (this.onComplete) {
      this.onComplete({
        total: this.totalTasks,
        completed: this.completedTasks,
        failed: this.failedTasks,
      })
    }
    return
  }

  const tasksToRun = this.tasks.splice(0, this.maxConcurrent)

  Promise.all(
    tasksToRun.map(({ task, name }) => {
      return new Promise<void>((resolve) => {
        console.log(`开始执行任务: ${name}`)

        task()
          .then((result) => {
            this.completedTasks++
            if (this.onProgress) {
              this.onProgress({
                name,
                status: 'success',
                result,
                progress: {
                  completed: this.completedTasks,
                  total: this.totalTasks,
                  remaining: this.tasks.length,
                  failed: this.failedTasks,
                },
              })
            }
            resolve()
          })
          .catch((error: Error) => {
            this.failedTasks++
            if (this.onError) {
              this.onError({
                name,
                error,
                progress: {
                  completed: this.completedTasks,
                  total: this.totalTasks,
                  remaining: this.tasks.length,
                  failed: this.failedTasks,
                },
              })
            }
            resolve() // 即使任务失败也继续执行其他任务
          })
      })
    })
  ).then(() => {
    if (this.tasks.length > 0) {
      // 添加延迟，避免请求过于频繁
      setTimeout(() => {
        this.runTasks()
      }, this.pauseBetweenTasks)
    } else {
      this.running = false
      if (this.onComplete) {
        this.onComplete({
          total: this.totalTasks,
          completed: this.completedTasks,
          failed: this.failedTasks,
        })
      }
    }
  })
}

// 添加类型声明以支持构造函数的使用
interface SchedulerConstructor {
  new (): Scheduler
  prototype: Scheduler
}

// 将 Scheduler 转换为构造函数类型
const SchedulerClass = Scheduler as unknown as SchedulerConstructor

export default SchedulerClass
