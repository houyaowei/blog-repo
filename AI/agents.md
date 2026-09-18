# AGENTS.md的作用和写法

## 相关概念

- Prompt： 用户向 AI 模型输入的指令或信息集合，可输入自然语言、图片、规则、上下文和指令等，用来触发模型生成特定输出的指令集合。
  MCP（Model Context Protocol）: 是一种开放协议，定义了 AI 模型与外部数据源、工具、服务之间的标准化交互方式，使模型能够动态获取上下文并执行实际操作（如查询数据库、调用 API），解决了大模型在实时数据与行动能力上的局限。
- Skill：Skill 是将完成某一类任务所需的指令、逻辑、脚本、资源等进行封装的可复用能力单元。它可以包含 prompt、调用外部工具的方式、处理流程等。当任务匹配时，AI（通常通过 Agent）可以按需加载并执行该 Skill，以提高效率和稳定性。
- Agent：Agent 是一个具备自主决策与执行能力的 AI 实体。它能理解复杂目标，进行任务规划，调用多个工具或 Skills，并根据执行结果进行迭代调整，直至完成目标。相比单次 Prompt 交互，Agent 拥有记忆、规划和多步骤执行的能力。

## AGENTS.md能干什么

AGENTS.md 是写给 AI 编程助手看的项目规范文件。有了它，AI 知道你的规矩，会按你定的规矩来。

## 一个示例

```md
# AGENTS.md

- 本项目为 React 19 + TypeScript 前端应用
- 包管理器：pnpm，Node >= 22.12.0
- 样式方案：Less + CSS Modules
- UI 组件库：antd v6

## Project Structure

src/
├── components/ # 通用组件（PascalCase）
├── pages/ # 页面组件
├── hooks/ # 自定义 Hooks
├── services/ # API 请求封装
├── models/ # 全局状态
├── utils/ # 工具函数
├── typings/ # 类型定义
└── constants/ # 常量

- Never edit src/.vite/ — 框架自动生成
- Never edit dist/ — 构建产物

## Coding Style

- 使用 interface 定义 Props
- 组件命名：PascalCase，文件名 index.tsx
- Never 使用 any 类型
- Never 使用内联样式

## Build Commands

pnpm dev # 开发服务器
pnpm build # 生产构建
pnpm lint # 格式化
```

## 写一个AGENTS.md

### 第一步，技术栈声明（必填）

这是 AGENTS.md 的"开场白"，告诉 AI 你的项目用了什么技术栈。

```md
# AGENTS.md

- 本项目为 React 19 + TypeScript 前端应用
- 包管理器：pnpm，Node >= 22.12.0
- 样式方案：Less + CSS Modules
- UI 组件库：antd v6
```

写法要点：

- 建议用列表而非段落——AI 解析列表的准确率更高
- 标明版本号——React 18 和 React 19 的写法不同
- 标明包管理器——否则 AI 可能给你 npm install 而不是 yarn add

如果团队有多个技术栈适配，可以分别列举出来：

```md
# Vue 3 项目

- 本项目为 Vue 3 + TypeScript 前端应用
- 构建工具：Vite 8
- 状态管理：Pinia
- UI 组件库：Ant-Design-Vue@4

# Next.js 项目

- 本项目为 Next.js 14 + TypeScript 全栈应用
- 路由方案：App Router
- 样式方案：Tailwind CSS v3
```

### 第二步，目录结构（必填）

告诉AI生成的文件都需要放到哪里。

写法要点：

- 每个目录后面加注释说明用途
- 只列到一级目录就够了——太深了 AI 反而会困惑
- 写清楚命名规范——比如"PascalCase"

### 第三步，编码规范（必填）

告诉 AI "在这个项目里，代码该怎么写"。

```md
## Coding Style

**TypeScript/React**

- 使用 interface 定义 Props 类型
- 组件使用 React.FC<Props>
- 组件命名：PascalCase，文件名 index.tsx

**样式（Less + CSS Modules）**

- 正确用法：import styles from './index.less'
- 使用方式：className={styles['my-class']}

**路径别名**

- @/_ → src/_
```

写法要点：

- 越具体越好——不要写"遵循最佳实践"，要写"使用 interface 不用 type"
- 给出正确用法示例——AI 读示例比读规则更准确

### 第四步，构建命令（建议写）

```md
## Build Commands

pnpm dev # 开发服务器
pnpm build # 生产构建
pnpm lint # 格式化
```

AI 帮你调试问题时可能需要运行命令。如果它不知道你用 pnpm dev 而不是 npm run dev，就会给你错误的指导。

### 第五步，声明Never 规则（必须且重要）

Never 规则告诉 AI "绝对不能做什么"

```md
## Never 规则

- Never 修改 src/.vite/ 或 src/.vite/ 目录
- Never 修改 dist/ 目录
- Never 在组件内使用 any 类型
- Never 使用内联样式（style={{ }}），除非需要动态计算
- Never 在 Less 中使用硬编码颜色值——使用主题变量
- Never 在渲染路径中执行耗时操作
- Never 在列表渲染中省略 key 属性
- Never 在 node_modules/ 中安装依赖
- Never 修改 lock 文件
```

### 团队协作约定（根据情况）

```md
## Commit 规范

- 格式：type(scope): description
- 类型：feat / fix / docs / style / refactor / test / chore

## 多 Agent 并发

- 禁止 git stash
- 禁止切换分支
- 只 commit 自己修改的文件
```

## 进阶技巧

### 技巧 1：DESIGN.md 联动视觉规范

```md
# DESIGN.md

## 品牌色

- 主色：#1677FF
- 主色悬浮：#4096FF
- 主色背景：rgba(22, 119, 255, 0.1)

## 文字色

- 主文字：rgba(0, 0, 0, 0.88)
- 次要文字：rgba(0, 0, 0, 0.65)

## 间距系统

- 基础单位：8px
- 组件间距：16px / 24px
```

### 技巧 2：AGENTS.local.md 个人偏好

创建一个 AGENTS.local.md（加入 .gitignore），写你的个人偏好：

```md
# AGENTS.local.md（不入仓库）

- 回复语言：中文
- 代码注释语言：中文
- 组件写法偏好：函数声明
- 类型定义偏好：interface
```

AI 会同时读取项目规范和你的个人偏好，输出更符合你习惯的代码。

### 技巧 3：Never 规则的持续演进

其实就是踩坑记录

## README

### AGENTS.md 放在哪里？

项目根目录。 和 package.json、tsconfig.json 同级。

但不同工具读取方式不同： AGENTS.md 更适合作为统一规范源文件；

- Cursor 用 Rules 接入
- Claude Code 用 CLAUDE.md 引用，
- GitHub Copilot 用 .github/copilot-instructions.md，

AI 编程助手会自动扫描项目根目录读取。

### 需要提交到 Git 吗？

需要。个人偏好的除外。

### 写多长合适？

- 最小可用版本：30 行（技术栈 + 目录 + 3 条 Never 规则）
- 推荐长度：60-100 行
- 不建议超过：200 行
