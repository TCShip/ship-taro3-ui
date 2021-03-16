import React from 'react';
import PropTypes, {InferProps} from 'prop-types'
// @ts-ignore 
import { AtFormProps } from 'types/form'
import { Form } from '@tarojs/components';
import classnames from 'classnames';
import AtComponent from '../../common/component'

export default class AtForm extends AtComponent<AtFormProps> {

    
	public static defaultProps: AtFormProps
	public static propTypes: InferProps<AtFormProps>
    constructor(props: AtFormProps) {
        super(props);
        this.state = {
        };
    }
    
    onSubmit(e) {
        this.props.onSubmit && this.props.onSubmit(e)
    }

    onReset(e) {
        this.props.onReset && this.props.onReset(e)
    }
    public render(): JSX.Element {
        
        const {
            customStyle,
            className,
            reportSubmit
        } = this.props
        const rootCls = classnames('at-form', className)
        return (
            <Form
              className={rootCls}
              style={customStyle}
              onSubmit={this.onSubmit.bind(this)}
              reportSubmit={reportSubmit}
              onReset={this.onReset.bind(this)}
            >
                {this.props.children}
            </Form>
        );
    }
}



AtForm.defaultProps = {
    customStyle: '',
    className: '',
    reportSubmit: false,
    onSubmit: () => {},
    onReset: () => {}
  }
  
  AtForm.propTypes = {
    customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    reportSubmit: PropTypes.bool,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func
  }
  