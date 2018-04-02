import React, { Component } from 'react';
import toBe from 'prop-types';
import classNames from 'classnames';
import './index.scss';

class IconLink extends Component {
  static propTypes = {
    icon: toBe.string,
    onClick: toBe.func,
    children: toBe.any,
    disabled: toBe.bool,
    className: toBe.string,
  };

  static defaultProps = {
    className: '',
    icon: '',
    onClick: () => {},
    children: '',
    disabled: false,
  };

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.onClick();
  }

  render() {
    const { icon, children, disabled, className } = this.props;
    return (
      <a
        className={classNames('icon-link', className, {
          '-disabled': disabled,
        })}
        href=""
        onClick={this.onClick}
      >
        <i className={`icon-${icon}`} />
        {children}
      </a>
    );
  }
}

export default IconLink;
