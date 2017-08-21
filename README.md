# milkui-pullrefresh

[![npm version](https://img.shields.io/npm/v/milkui-pullrefresh.svg?style=flat)](https://www.npmjs.com/package/milkui-pullrefresh) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](README.md)

[![NPM](https://nodei.co/npm/milkui-pullrefresh.png?downloads=true&downloadRank=true)](https://nodei.co/npm/milkui-pullrefresh/)

> 下拉/上拉刷新

## Overview

![image](https://user-images.githubusercontent.com/11053605/28750727-e5636c58-7525-11e7-9c7f-7f3e9ed08dc5.png)

## Example

```js
import PullRefresh from 'milkui-pullrefresh';

<PullRefresh
  ref={(f) => { this.pullRefresh = f; }}
  topLoad
  onTopLoad={this.events.loadTopData}
  distanceIndex={3}
  bottomLoad
  onBottomLoad={this.events.loadBottomData}
>
  <div className="demo__pullrefresh__list">
    {list.map((item) =>
      <div key={item} className="demo__pullrefresh__item">{item}</div>
    )}
  </div>
</PullRefresh>

// mock loadTopData
loadTopData() {
  const me = this;
  const { list } = me.state;
  let newList = Array.from(list);
  const firstItem = newList[0];
  for (let i = 1; i < 11; i++) {
    newList = [firstItem - i, ...newList];
  }
  setTimeout(() => {
    me.setState({ list: newList }, () => {
      me.pullRefresh.onTopLoaded();
    });
  }, 2000);
}

// mock loadBottomData
loadBottomData() {
  const me = this;
  const { list } = me.state;
  let newList = Array.from(list);
  const lastItem = newList[newList.length - 1];
  for (let i = 1; i < 11; i++) {
    newList = [...newList, lastItem + i];
  }
  setTimeout(() => {
    me.setState({ list: newList }, () => {
      me.pullRefresh.onBottomLoaded();
    });
  }, 2000);
}
```

## Properties

| Property | Type | Description | Default |
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


## Develop

```bash
cnpm i milk-dev -g    # dev tool

cnpm install

npm start
```

## Links

- [Issues](https://github.com/milk-ui/milkui-pullrefresh/issues)
