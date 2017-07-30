/**
 * PullRefresh of milkui-component
 * @author caiyongmin
 *
 * Copyright 2017-2019, All rights reserved.
 */

import React, { Component } from 'react';

import PullRefresh from './../src';
import './Demo.scss';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: Array.from(new Array(21)).map((item, i) => i),
    };
    this.events = {
      loadTopData: this.loadTopData.bind(this),
      loadBottomData: this.loadBottomData.bind(this),
    };
  }

  render() {
    const { list } = this.state;

    return (
      <div className="demo__panel">
        <div className="demo__title">PullRefresh</div>
        <div className="demo__description">
          This is a demo page, enjoy it! ✌️
        </div>
        <div className="demo__item">
          <p className="demo__item__description">请在手机上查看</p>
          <p className="demo__item__description">在列表顶端, 按住 - 下拉 - 释放获取更多数据</p>
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
          <p className="demo__item__description">在列表底端, 按住 - 上拉 - 释放获取更多数据</p>
        </div>
      </div>
    );
  }

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
}

export default Demo;
