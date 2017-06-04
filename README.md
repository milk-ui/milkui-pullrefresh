# milkui-pullrefresh

组件描述

## 效果图

...some images

## 使用

```js
import PullRefresh from 'milkui-pullrefresh';

<PullRefresh></PullRefresh>
```

## 参数

| Properties | Type | Description | Default |
| -- | -- | -- | -- |
| className | String | 自定义的 class 类名 | '' |
| topPullText | String | 顶部下拉时的文字提示 | '↓ 下拉' |
| topDropText | String | 顶部下拉后可以刷新时的文字提示 | '↑ 释放' |
| topLoadingText | String | 顶部下拉更新时的文字提示 | 'loading...' |
| bottomPullText | String | 底部上拉时的文字提示 | '↑ 上拉' |
| bottomDropText | String | 底部上拉后可以刷新时的文字提示 | '↓ 释放' |
| bottomLoadingText | String | 底部上拉更新时的文字提示 | 'loading...' |
| distanceIndex | Number | 手指移动与组件移动距离的比值 | 2 |
| topLoadDistance | Number | 顶部下拉更新的阈值 | 70 |
| bottomLoadDistance | Number | 底部下拉更新的阈值 | 70 |
| topLoad | Boolean | 顶部下拉更新 | false |
| bottomLoad | Boolean | 底部下拉更新 | false |
| onTopLoad | Function | 顶部下拉更新时的回调函数 |  |
| onBottomLoad | Function | 底部下拉更新时的回调函数 |  |


## 开发

### install

```bash
cnpm i milk-dev -g    # 组件开发工具
cnpm install
npm start
```

## 链接

- [Issues](https://github.com/milk-ui/milkui-pullrefresh/issues)
