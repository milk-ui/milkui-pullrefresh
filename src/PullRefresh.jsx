/**
 * PullRefresh of milkui-component
 * @author caiyongmin
 *
 * Copyright 2017-2019, All rights reserved.
 */


import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import {
  getScrollEventTarget, getScrollTop, checkBottomReached, getComputedHeight,
} from './utils';

import './index.scss';

class PullRefresh extends Component {
  static propTypes = {
    className: PropTypes.string,
    topPullText: PropTypes.string,
    topDropText: PropTypes.string,
    topLoadingText: PropTypes.string,
    bottomPullText: PropTypes.string,
    bottomDropText: PropTypes.string,
    bottomLoadingText: PropTypes.string,
    topLoad: PropTypes.bool,
    bottomLoad: PropTypes.bool,
    topLoadDistance: PropTypes.number,
    bottomLoadDistance: PropTypes.number,
    distanceIndex: PropTypes.number,
    onTopLoad: PropTypes.func,
    onBottomLoad: PropTypes.func,
    children: PropTypes.func,
  }
  static defaultProps = {
    className: '',
    topPullText: '↓ 下拉',
    topDropText: '↑ 释放',
    topLoadingText: 'loading...',
    bottomPullText: '↑ 上拉',
    bottomDropText: '↓ 释放',
    bottomLoadingText: 'loading...',
    topLoad: false,
    topLoadDistance: 70,
    bottomLoadDistance: 70,
    distanceIndex: 2,
    onTopLoad: null,
  }
  constructor(props) {
    super(props);
    this.contentEle = null;
    this.scrollEventTarget = null;
    this.topDropped = false;
    this.bottomDropped = false;
    this.bottomReached = false;
    this.direction = '';
    this.startY = 0;
    this.clientY = 0;
    this.startScrollTop = 0;
    this.state = {
      translate: 0,
      topStatus: 'pull',
      bottomStatus: 'pull',
      topText: this.props.topPullText,
      bottomText: this.props.bottomPullText,
    };
    this.events = {
      onContentTouchStart: this.onContentTouchStart.bind(this),
      onContentTouchMove: this.onContentTouchMove.bind(this),
      onContentTouchEnd: this.onContentTouchEnd.bind(this),
    };
  }

  componentDidMount() {
    this.scrollEventTarget = getScrollEventTarget(this.contentEle);
    this.dpr = window.devicePixelRatio || 1;
  }

  render() {
    const { translate } = this.state;
    const { className, children } = this.props;
    const wrapCls = classnames('milkui-pullrefresh', className);

    return (
      <div className={wrapCls}>
        {this.renderTopLoader()}
        <div
          ref={(r) => { this.contentEle = r; }}
          className="milkui-pullrefresh__content"
          style={{ transform: `translate3d(0, ${getComputedHeight(translate, this.dpr)}px, 0)` }}
          onTouchStart={this.events.onContentTouchStart}
          onTouchMove={this.events.onContentTouchMove}
          onTouchEnd={this.events.onContentTouchEnd}
        >{children}</div>
        {this.renderBottomLoader()}
      </div>
    );
  }

  renderTopLoader() {
    const { topText, translate } = this.state;
    const height = getComputedHeight(translate, this.dpr);
    return (
      <div className="milkui-pullrefresh__top" style={{ height: `${height}px` }}>
        <span className="milkui-pullrefresh__loader__text">{topText}</span>
      </div>
    );
  }

  renderBottomLoader() {
    const { bottomText, translate } = this.state;
    const height = Math.abs(getComputedHeight(translate, this.dpr));
    return (
      <div className="milkui-pullrefresh__bottom" style={{ height: `${height}px` }}>
        <span className="milkui-pullrefresh__loader__text">{bottomText}</span>
      </div>
    );
  }

  onContentTouchStart(e) {
    const { topStatus, bottomStatus } = this.state;
    const { topPullText, bottomPullText } = this.props;
    this.startY = e.touches[0].clientY;
    this.startScrollTop = getScrollTop(this.scrollEventTarget);
    // handle top pull refresh
    if (topStatus !== 'loading') {
      this.topDropped = false;
      this.setState({
        topStatus: 'pull',
        topText: topPullText,
      });
    }
    // handle bottom pull refresh
    this.bottomReached = false;
    if (bottomStatus !== 'loading') {
      this.bottomDropped = false;
      this.setState({
        bottomStatus: 'pull',
        bottomText: bottomPullText,
      });
    }
  }

  onContentTouchMove(e) {
    if (
      this.startY < this.contentEle.getBoundingClientRect().top &&
      this.startY > this.contentEle.getBoundingClientRect().bottom
    ) {
      return;
    }

    const { topStatus, bottomStatus } = this.state;
    const {
      distanceIndex, topLoad, onTopLoad, topLoadDistance, topDropText, topPullText,
      bottomLoad, onBottomLoad, bottomLoadDistance, bottomDropText, bottomPullText,
    } = this.props;
    this.currentY = e.touches[0].clientY;
    const distance = (this.currentY - this.startY) / distanceIndex;
    this.direction = distance > 0 ? 'down' : 'up';
    // handle top pull refresh
    if (
      topLoad &&
      typeof onTopLoad === 'function' &&
      getScrollTop(this.scrollEventTarget) === 0 &&
      this.direction === 'down' &&
      topStatus !== 'loading'
    ) {
      e.preventDefault();
      e.stopPropagation();
      let translate = distance - this.startScrollTop;
      if (translate < 0) {
        translate = 0;
      }
      this.setState({
        translate,
        topStatus: translate >= topLoadDistance ? 'drop' : 'pull',
        topText: translate >= topLoadDistance ? topDropText : topPullText,
      });
    }
    // handler bottom pull refresh
    if (this.direction === 'up') {
      this.bottomReached = this.bottomReached ||
        checkBottomReached(this.scrollEventTarget, this.contentEle);
    }
    if (
      bottomLoad &&
      typeof onBottomLoad === 'function' &&
      this.bottomStatus !== 'loading' &&
      this.direction === 'up' &&
      this.bottomReached
    ) {
      e.preventDefault();
      e.stopPropagation();
      let translate = (getScrollTop(this.scrollEventTarget) - this.startScrollTop) + distance;
      if (translate > 0) {
        translate = 0;
      }
      const status = -translate >= bottomLoadDistance ? 'drop' : 'pull';
      const text = bottomStatus === 'drop' ? bottomDropText : bottomPullText;
      console.info('=== status ===', status);
      this.setState({
        translate,
        bottomStatus: status,
        bottomText: text,
      });
    }
  }

  onContentTouchEnd() {
    const { translate, topStatus, bottomStatus } = this.state;
    const {
      topLoadingText, topPullText, onTopLoad,
      bottomLoadingText, bottomPullText, onBottomLoad,
    } = this.props;
    // handle top pull refresh
    if (
      this.direction === 'down' &&
      getScrollTop(this.scrollEventTarget) === 0 &&
      translate > 0
    ) {
      this.topDropped = true;
      if (topStatus === 'drop') {
        this.setState({
          translate: 30,
          topStatus: 'loading',
          topText: topLoadingText,
        });
        onTopLoad();  // run onTopLoad function
      } else {
        this.setState({
          translate: 0,
          topStatus: 'pull',
          topText: topPullText,
        });
      }
    }
    // handle bottom pull refresh
    console.info('=== this.direction ===', this.direction);
    console.info('=== this.bottomReached ===', this.bottomReached);
    console.info('=== translate ===', translate);
    if (
      this.direction === 'up' &&
      this.bottomReached &&
      translate < 0
    ) {
      this.bottomDropped = true;
      this.bottomReached = false;
      console.info('=== bottomStatus ===', bottomStatus);
      if (bottomStatus === 'drop') {
        console.info('=== bottomStatus drop ===');
        this.setState({
          translate: -30,
          bottomStatus: 'loading',
          bottomText: bottomLoadingText,
        });
        onBottomLoad();  // run onBottomLoad function
      } else {
        console.info('=== bottomStatus pull ===');
        this.setState({
          translate: 0,
          bottomStatus: 'pull',
          bottomText: bottomPullText,
        });
      }
    }
  }

  onTopLoaded() {
    const { topPullText } = this.props;
    this.setState({
      translate: 0,
      topStatus: 'pull',
      topText: topPullText,
    });
  }

  onBottomLoaded() {
    const { bottomPullText } = this.props;
    this.setState({
      translate: 0,
      bottomStatus: 'pull',
      bottomText: bottomPullText,
    });
  }
}

export default PullRefresh;
