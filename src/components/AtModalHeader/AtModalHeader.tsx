import React from 'react';
// @ts-ignore 
import { AtModalHeaderProps } from 'types/modal'
import { View } from '@tarojs/components';
import classNames from 'classnames'
import AtComponent from '../../common/component';

export default class AtModalHeader extends AtComponent<AtModalHeaderProps> {
    constructor(props: AtModalHeaderProps) {
        super(props);
        this.state = {
        };
    }

    public render(): JSX.Element {
        const rootClass = classNames('at-modal__header', this.props.className)
        return (
            <View className={rootClass}>{this.props.children}</View>
        );
    }
}

