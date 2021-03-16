import React from 'react';

import { View } from '@tarojs/components';
import classNames from 'classnames'
import _isFunction from 'lodash/isFunction'
import AtComponent from '../../common/component'


interface AtActionSheetItemProps {
    className?: any;
    children?: any;
    handleClick?: Function;
    onClick?: Function;
}

interface AtActionSheetItemState {
}

export default class AtActionSheetItem extends AtComponent<AtActionSheetItemProps, AtActionSheetItemState> {
    constructor(props: AtActionSheetItemProps) {
        super(props);
        this.state = {
        };
    }
    private handleClick = (args: any): void => {
      if (_isFunction(this.props.onClick)) {
        this.props.onClick && this.props.onClick(args)
      }
    }

    public render(): JSX.Element {
        const rootClass = classNames('at-action-sheet__item', this.props.className)
    
        return (
            <View className={rootClass} onClick={this.handleClick}>
            {this.props.children}
        </View>
        );
    }
}

