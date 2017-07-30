/**
 * PullRefresh of milkui-component
 * @author caiyongmin
 *
 * Copyright 2017-2019, All rights reserved.
 */

import React, { PropTypes } from 'react';
import classnames from 'classnames';

class Icon extends React.Component {
  static propTypes = {
    glyph: PropTypes.node,
    className: PropTypes.string,
  }

  render() {
    const glyph = this.props.glyph;
    return (
      <svg
        className={classnames('milkui-icon', this.props.className)}
        dangerouslySetInnerHTML={{ __html: `<use xlink:href="${glyph}"></use>` }}
      />
    );
  }
}

export default Icon;
