import React from 'react';

import { View } from '@tarojs/components';
import classNames from 'classnames'
import _isFunction from 'lodash/isFunction'
import AtComponent from '../../common/component'

interface AtActionSheetFooterProps {
    className?: any;
    onClick: Function;
}

interface AtActionSheetFooterState {
}

export default class AtActionSheetFooter extends AtComponent<AtActionSheetFooterProps, AtActionSheetFooterState> {
    constructor(props: AtActionSheetFooterProps) {
        super(props);
        this.state = {
        };
    }

    private handleClick = (...args: any[]): void => {
      if (_isFunction(this.props.onClick)) {
        this.props.onClick(...args)
      }
    }
  
    public render(): JSX.Element {
        const rootClass = classNames(
            'at-action-sheet__footer',
            this.props.className
          )
      
        return (
            <View onClick={this.handleClick} className={rootClass}>
                {this.props.children}
            </View>
        );
    }
}

