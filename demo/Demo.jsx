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
      list: Array.from(new Array(20)).map((item, i) => i),
    };
    this.events = {
      handleLoadTopData: this.handleLoadTopData.bind(this),
    };
  }

  render() {
    const { list } = this.state;

    return (
      <div className="demo-panel">
        <div className="demo-title">PullRefresh</div>
        <div className="demo-description">
          This is a demo page, enjoy it! 😀 ✌️
        </div>
        <div className="demo-item">
          <p className="demo-item-description">在列表顶端, 按住 - 下拉 - 释放可以获取更多数据</p>
          <PullRefresh
            ref={(f) => { this.pullRefresh = f; }}
            topLoad
            onTopLoad={this.events.handleLoadTopData}
            distanceIndex={3}
          >
            <div className="demo-pullrefresh-list">
              {list.map((item) =>
                <div className="demo-pullrefresh-item">{item}</div>
              )}
            </div>
          </PullRefresh>
        </div>
      </div>
    );
  }

  handleLoadTopData() {
    const me = this;
    const { list } = this.state;
    let newList = Array.from(list);
    const firstItem = newList[0];
    for (let i = 1; i < 11; i++) {
      newList = [firstItem - i, ...newList];
    }
    setTimeout(() => {
      me.setState({ list: newList }, () => {
        console.info('=== topLoadData ===');
        me.pullRefresh.onTopLoaded();
      });
    }, 2500);
  }
}

export default Demo;
