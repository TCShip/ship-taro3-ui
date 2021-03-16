import React from 'react';
// @ts-ignore 
import { AtModalContentProps } from 'types/modal'
import classNames from 'classnames'
import { ScrollView } from '@tarojs/components';
import AtComponent from '../../common/component';

export default class AtModalContent extends AtComponent<AtModalContentProps> {
    constructor(props: AtModalContentProps) {
        super(props);
        this.state = {
        };
    }

    public render(): JSX.Element {
        const rootClass = classNames('at-modal__content', this.props.className)
        return (
            <ScrollView scrollY className={rootClass}>{this.props.children}</ScrollView>
        );
    }
}

