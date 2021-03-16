import React from 'react';

import { View } from '@tarojs/components';
import classNames from 'classnames'
import AtComponent from '../../common/component'

interface AtActionSheetBodyProps {
    className?: any;
}

interface AtActionSheetBodyState {
}

export default class AtActionSheetBody extends AtComponent<AtActionSheetBodyProps, AtActionSheetBodyState> {
    constructor(props: AtActionSheetBodyProps) {
        super(props);
        this.state = {
        };
    }

    public render(): JSX.Element {
        const rootClass = classNames('at-action-sheet__body', this.props.className)
        return (
            <View className={rootClass}>{this.props.children}</View>
        );
    }
}

