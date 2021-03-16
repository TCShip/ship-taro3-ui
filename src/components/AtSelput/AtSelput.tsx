import React from 'react';
import PropTypes, {InferProps } from 'prop-types'
// @ts-ignore 
import { AtSelputProps } from 'types/selput'
import classnames from 'classnames';
import { View, Text, Label, Input } from '@tarojs/components';
import AtIcon from '../AtIcon/AtIcon';
import AtActionSheet from '../AtActionSheet/AtActionSheet';
import AtActionSheetItem from '../AtActionSheetItem/AtActionSheetItem';
import AtComponent from '../../common/component';


function getInputProps (props) {
    const actualProps = {
        type: props.type,
        maxLength: props.maxLength,
        disabled: props.disabled,
        password: false,
    }
    switch (actualProps.type) {
        case 'phone':
            actualProps.type = 'number'
            actualProps.maxLength = 11
            break
        case 'password':
            actualProps.password = true
            break
        default:
            break
    }
    if (!props.disabled && !props.editable) {
        actualProps.disabled = true
    }
    return actualProps
}
export default class AtSelput extends AtComponent<AtSelputProps> {
    public static defaultProps: AtSelputProps
    public static propTypes: InferProps<AtSelputProps>
    constructor(props: AtSelputProps) {
        super(props);
        this.state = {
        };
    }
    onInput = event => this.props.onChange(event.target.value, event)

    onFocus = event => this.props.onFocus && this.props.onFocus(event.target.value, event)
  
    onBlur = event => {
        this.props.onBlur && this.props.onBlur(event.target.value, event)
      // fix # 583 AtInput 不触发 onChange 的问题
      this.props.onChange(event.target.value, event)
    }
  
    onConfirm = event => this.props.onConfirm && this.props.onConfirm(event.target.value, event)
  
    onClick = () => !this.props.editable && this.props.onClick && this.props.onClick()
  
    clearValue = () => this.props.onChange('')
  
    onErrorClick = () => this.props.onErrorClick && this.props.onErrorClick()
    onTipsClick = (e) => this.props.onTipsClick && this.props.onTipsClick(e)

    onSelect = item => {
        this.props.onSelect && this.props.onSelect(item)
        
    }

    chooseCert(e) {
        const { selData } = this.props;
        if(selData && selData.length > 1) {
            this.props.onChooseCerts && this.props.onChooseCerts(e)
        }
    }

    closeActionSheet = (e) => this.props.closeActionSheet && this.props.closeActionSheet(e)

    public render(): JSX.Element {
        const {
            className,
            customStyle,
            name,
            cursorSpacing,
            confirmType,
            cursor,
            selectionStart,
            selectionEnd,
            adjustPosition,
            border,
            title,
            error,
            clear,
            placeholder,
            placeholderStyle,
            placeholderClass,
            autoFocus,
            focus,
            value,
            selData,

            showTip,
            isOpened
        } = this.props

        const {
            type,
            maxLength,
            disabled,
            password,
        } = getInputProps(this.props)
    
        const rootCls = classnames(
        'at-input',
        {
            'at-input--without-border': !border,
        }, className
        )
        const containerCls = classnames(
        'at-input__container',
        {
            'at-input--error': error,
            'at-input--disabled': disabled
        }
        )
        const overlayCls = classnames(
        'at-input__overlay',
        {
            'at-input__overlay--hidden': !disabled
        }
        )
        const placeholderCls = classnames('placeholder', placeholderClass)

        return (
            <View className={rootCls} style={customStyle}>
                <View className={containerCls}>
                    <View className={overlayCls} onClick={this.onClick}></View>
                    { title && (<View className='at-input__title' onClick={this.chooseCert.bind(this)}>
                        <Label  for={name} >
                            {title}
                        </Label>
                        {
                            showTip && selData && selData.length > 1? (<View className='at-input__icon'><AtIcon prefixClass='shipfont' value={showTip || 'iconzhuyi1'} size='24' customStyle='margin-left:10px;' color='#dedfe4'></AtIcon></View>): null
                        }
                        </View>)
                    }
                    <Input
                      className='at-input__input'
                      id={name}
                      name={name}
                      type={type}
                      password={password}
                      placeholderStyle={placeholderStyle}
                      placeholderClass={placeholderCls}
                      placeholder={placeholder}
                      cursorSpacing={cursorSpacing}
                      maxlength={maxLength}
                      autoFocus={autoFocus}
                      focus={focus}
                      value={value}
                      confirmType={confirmType}
                      cursor={cursor}
                      selectionStart={selectionStart}
                      selectionEnd={selectionEnd}
                      adjustPosition={adjustPosition}
                      onInput={this.onInput}
                      onFocus={this.onFocus}
                      onBlur={this.onBlur}
                      onConfirm={this.onConfirm}
                    />
                    {clear && value && (
                    <View className='at-input__icon' onTouchStart={this.clearValue}>
                        <Text className='at-icon at-icon-close-circle at-input__icon-close'></Text>
                    </View>
                    )}
                    {error && (
                    <View className='at-input__icon' onTouchStart={this.onErrorClick}>
                        <Text className='at-icon at-icon-alert-circle at-input__icon-alert'></Text>
                    </View>
                    )}
                    <View className='at-input__children'>{this.props.children}</View>
                </View>
                <AtActionSheet isOpened={isOpened} onClose={this.closeActionSheet}>
                    {
                        selData && selData.length > 0 && selData.map(item => {
                            return (<AtActionSheetItem onClick={this.onSelect.bind(this, item)}>
                                {item.CertName}
                            </AtActionSheetItem>)
                        }) 
                    }
                </AtActionSheet>
            </View>
        );
    }
}

AtSelput.defaultProps = {
    className: '',
    customStyle: '',
    value: '',
    name: '',
    placeholder: '',
    placeholderStyle: '',
    placeholderClass: '',
    title: '',
    cursorSpacing: 50,
    confirmType: 'done',
    cursor: 0,
    selectionStart: -1,
    selectionEnd: -1,
    adjustPosition: true,
    maxLength: 140,
    type: 'text',
    disabled: false,
    border: true,
    editable: true,
    error: false,
    clear: false,
    autoFocus: false,
    focus: false,
    showTip: false,
    selData: [],
    isOpened: false,


    onFocus: () => {},
    onBlur: () => {},
    onConfirm: () => {},
    onClick: () => {},
    onChange: () => {},
    onErrorClick: () => {},
}

AtSelput.propTypes = {
    className: PropTypes.string,
    customStyle: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderStyle: PropTypes.string,
    placeholderClass: PropTypes.string,
    title: PropTypes.string,
    cursorSpacing: PropTypes.number,
    confirmType: PropTypes.string,
    cursor: PropTypes.number,
    selectionStart: PropTypes.number,
    selectionEnd: PropTypes.number,
    adjustPosition: PropTypes.bool,
    maxLength: PropTypes.number,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    border: PropTypes.bool,
    editable: PropTypes.bool,
    error: PropTypes.bool,
    clear: PropTypes.bool,
    autoFocus: PropTypes.bool,
    focus: PropTypes.bool,
    showTip: PropTypes.bool,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onConfirm: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onErrorClick: PropTypes.func,
}