## Vue Router

### 起步

- 在Vue项目中注入路由器后，`this.$router`访问路由器，`this.$route`访问当前路由
- 当`<router-link>`对应的路由匹配成功时，将自动设置class属性值`.router-link-active`

### 动态路由匹配

- 路径参数使用` : `标记。当匹配到一个路由时，参数值会被设置到`this.$route.params`
- 路径参数使用` ? `标记。当匹配到一个路由时，参数值会被设置到`this.$route.query`
- 路径参数使用` # `标记。当匹配到一个路由时，参数值会被设置到`this.$route.hash`
- `注意`：当使用路由参数时，例如从`/user/foo`导航到`/user/bar`，**原来的组件实例会被复用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，**这也意味着组件的生命周期钩子不会再被调用**。
- 复用组件时，想对路由参数的变化作出响应的话，你可以简单地`watch(监测变化)$route对象`，也可以用2.2中引入的`beforeRouteUpdate`导航守卫
- 捕获所有路由或404 Not found路由。通配符` * `，一般放置在最后边。`this.$route.pathMatch`包含了URL通过通配符被匹配的部分
- 路由匹配优先级：匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。

### 嵌套路由

- 要在嵌套的出口中渲染组件，需要在VueRouter的参数中使用`children`配置
- 一个被渲染组件可以包含自己的嵌套`<router-view>`
- `注意`：**以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径**。
- 提供一个`空的`子路由，可以在没有匹配到合适的子路由的情况下，渲染点什么

### 编程式的导航

- 路由模式：`history`，`hash`，`abstract`
- 导航方法：`push`，`replace`，`go`
- 声明式的导航：`<router-link>`创建 a 标签来定义导航链接
- `router.push(location, onComplete ?, onAbort ?)`
    - 这个方法会向history栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的URL。
    - `<router-link :to="...">`相当于`router.push(...)`和`window.history.pushState()`
    - 入参如下：
    ```js
    // 字符串
    router.push('home')

    // 对象
    router.push({ path: 'home' })

    // 命名的路由
    router.push({ name: 'user', params: { userId: '123' }})

    // 带查询参数，变成 /register?plan=private
    router.push({ path: 'register', query: { plan: 'private' }})
    ```
    - `注意`：**如果提供了 path，params 会被忽略**
    ```js
    // 这里的 params 不生效
    router.push({ path: '/user', params: { userId }}) // -> /user
    ```
    - `同样的规则也适用于 router-link 组件的 to 属性`。
    - `onComplete`和`onAbort`回调作为第二个和第三个参数。这些回调将会在导航成功完成或终止的时候进行相应的调用
    - 如果支持Promise，`router.push()`将返回一个Promise
- `router.replace()`，是替换掉当前的 history 记录。和`<router-link :to="..." replace>`，以及`window.history.reaplceState()`一样的效果
- `router.go(n)`相当于`window.history.go(n)`
    - `router.go(1)`相当于`history.forward()`
    - `router.go(-1)`相当于`history.back()`
    - `router.go(n)`，如果 history 记录不够用，那就默默地失败呗

### 命名路由

- name

### 命名视图

- 多个`<router-view>`，需要添加`name`属性来区别，没有name属性的，就是默认的视图出口
- 当有多个`<router-view>`时，route中的`component`注意得是复数，得加` s `
```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

### 重定向和别名

- 通过`route`配置来完成
- redirect：可以是字符串，对象，函数(要有返回值，且返回重定向的地址)
- alias：`/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样`。
```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```
- “别名”的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构

### 路由组件传参

- 使用 props 将组件和路由解耦
    - 布尔模式：如果 props 被设置为 true，route.params 将会被设置为组件属性
    - 对象模式
    - 函数模式

### HTML5 History 模式

### 导航守卫

- **参数或查询的改变并不会触发进入/离开的导航守卫**
- 全局前置守卫：`router.beforeEach((to, from, next) => { // ... })`
- 全局解析守卫：`router.beforeResolve((to, from, next) => { // ... })`
- 全局后置钩子：`router.afterEach((to, from) => { // ... })`
- 路由独享的守卫： `beforeEnter((to, from, next) => { // ... })`
- 组件内的守卫
    - `注意` **beforeRouteEnter 是支持给 next 传递回调的唯一守卫。对于 beforeRouteUpdate 和 beforeRouteLeave 来说，this 已经可用了，所以不支持传递回调，因为没有必要了**。
    - beforeRouteEnter
        - 在渲染该组件的对应路由被 confirm 前调用
        - 不！能！获取组件实例 `this`
        - 因为当守卫执行前，组件实例还没被创建
        - 不过，可以通过传一个回调给 next来访问组件实例
        ```js
        beforeRouteEnter (to, from, next) {
          next(vm => {
            // 通过 `vm` 访问组件实例
          })
        }
        ```
    - beforeRouteUpdate (2.2 新增)
        - 在当前路由改变，但是该组件被复用时调用
        - 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        - 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        - 可以访问组件实例 `this`
    - beforeRouteLeave
        - 导航离开该组件的对应路由时调用
        - 可以访问组件实例 `this`
- 完整的导航解析流程
    1. 导航被触发。
    2. 在失活的组件里调用离开守卫。
    3. 调用全局的 beforeEach 守卫。
    4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
    5. 在路由配置里调用 beforeEnter。
    6. 解析异步路由组件。
    7. 在被激活的组件里调用 beforeRouteEnter。
    8. 调用全局的 beforeResolve 守卫 (2.5+)。
    9.  导航被确认。
    10. 调用全局的 afterEach 钩子。
    11. 触发 DOM 更新。
    12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

### 过渡动效

### 数据获取

- `导航完成后获取数据`：当你使用这种方式时，我们会马上导航和渲染组件，然后在组件的 created 钩子中获取数据。这让我们有机会在数据获取期间展示一个 loading 状态，还可以在不同视图间展示不同的 loading 状态。
- `在导航完成前获取数据`：通过这种方式，我们在导航转入新的路由前获取数据。我们可以在接下来的组件的 beforeRouteEnter 守卫中获取数据，当数据获取成功后只调用 next 方法。

### 滚动行为

### 路由懒加载




