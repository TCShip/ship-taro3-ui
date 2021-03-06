import React from 'react';
import Taro from '@tarojs/taro';
import PropTypes, {InferProps } from 'prop-types'
// @ts-ignore 
import { AtTextareaProps, AtTextareaState } from 'types/textarea'
import classNames from 'classnames'
import { View, Textarea } from '@tarojs/components';
import { CommonEvent } from '@tarojs/components/types/common'
import { initTestEnv } from '../../common/utils';
import AtComponent from '../../common/component';

initTestEnv()

function getMaxLength (
    maxLength: number,
    textOverflowForbidden: boolean
  ): number {
    if (!textOverflowForbidden) {
      return maxLength + 500
    }
    return maxLength
  }

const ENV = Taro.getEnv()
initTestEnv()

export default class AtTextarea extends AtComponent<AtTextareaProps, AtTextareaState> {
  public static defaultProps: AtTextareaProps
  public static propTypes: InferProps<AtTextareaProps>
    
    constructor(props: AtTextareaProps) {
        super(props);
        this.state = {
          isWEB: Taro.getEnv() === Taro.ENV_TYPE.WEB,
          isALIPAY: Taro.getEnv() === Taro.ENV_TYPE.ALIPAY,
        };
    }

    private handleInput = (event: CommonEvent): void => {
        this.props.onChange(event)
      }
    
      private handleFocus = (event: CommonEvent): void => {
        this.props.onFocus && this.props.onFocus(event)
      }
    
      private handleBlur = (event: CommonEvent): void => {
        this.props.onBlur && this.props.onBlur(event)
      }
    
      private handleConfirm = (event: CommonEvent): void => {
        this.props.onConfirm && this.props.onConfirm(event)
      }
    
      private handleLinechange = (event: CommonEvent) => {
        this.props.onLinechange && this.props.onLinechange(event)
      }
    

    public render(): JSX.Element {
        const {
            customStyle,
            className,
            value,
            cursorSpacing,
            placeholder,
            placeholderStyle,
            placeholderClass,
            maxLength,
            count,
            disabled,
            autoFocus,
            focus,
            showConfirmBar,
            selectionStart,
            selectionEnd,
            fixed,
            textOverflowForbidden,
            height
          } = this.props
      
          const _maxLength = parseInt(maxLength!.toString())
          const actualMaxLength = getMaxLength(_maxLength, textOverflowForbidden!)
          const textareaStyle = height ? `height:${Taro.pxTransform(Number(height))}` : ''
          const rootCls = classNames(
            'at-textarea',
            `at-textarea--${ENV}`,
            {
              'at-textarea--error': _maxLength < value.length
            }, className
          )
          const placeholderCls = classNames('placeholder', placeholderClass)
      
        return (
            <View className={rootCls} style={customStyle}>
                <Textarea
                  className='at-textarea__textarea'
                  style={textareaStyle}
                  placeholderStyle={placeholderStyle}
                  placeholderClass={placeholderCls}
                  cursorSpacing={cursorSpacing}
                  value={value}
                  maxlength={actualMaxLength}
                  placeholder={placeholder}
                  disabled={disabled}
                  autoFocus={autoFocus}
                  focus={focus}
                  showConfirmBar={showConfirmBar}
                  selectionStart={selectionStart}
                  selectionEnd={selectionEnd}
                  fixed={fixed}
                  onInput={this.handleInput}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  onConfirm={this.handleConfirm}
                  onLineChange={this.handleLinechange}
                />
                {count && !this.state.isALIPAY && (
                <View className='at-textarea__counter'>
                    {value.length}/{_maxLength}
                </View>
                )}
            </View>
        );
    }
}

AtTextarea.defaultProps = {
  customStyle: '',
  className: '',
  value: '',
  cursorSpacing: 100,
  maxLength: 200,
  placeholder: '',
  disabled: false,
  autoFocus: false,
  focus: false,
  showConfirmBar: false,
  selectionStart: -1,
  selectionEnd: -1,
  count: true,
  fixed: false,
  height: '',
  textOverflowForbidden: true,
  onLinechange: () => {},
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onConfirm: () => {}
}

AtTextarea.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  value: PropTypes.string.isRequired,
  cursorSpacing: PropTypes.number,
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholderClass: PropTypes.string,
  placeholderStyle: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  focus: PropTypes.bool,
  showConfirmBar: PropTypes.bool,
  selectionStart: PropTypes.number,
  selectionEnd: PropTypes.number,
  count: PropTypes.bool,
  textOverflowForbidden: PropTypes.bool,
  fixed: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLinechange: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onConfirm: PropTypes.func
}
