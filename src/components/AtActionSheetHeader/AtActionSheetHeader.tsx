import React from 'react';

import { View } from '@tarojs/components';
import classNames from 'classnames'

import AtComponent from '../../common/component'

interface AtActionSheetHeaderProps {
    className?: any;
}

interface AtActionSheetHeaderState {
}

export default class AtActionSheetHeader extends AtComponent<AtActionSheetHeaderProps, AtActionSheetHeaderState> {
    constructor(props: AtActionSheetHeaderProps) {
        super(props);
        this.state = {
        };
    }

    public render(): JSX.Element {
        const rootClass = classNames('at-action-sheet__header', this.props.className)

        return (
            <View className={rootClass}>{this.props.children}</View>
        );
    }
}

