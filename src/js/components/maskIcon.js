import React, { Component } from 'react'
import _ from 'lodash';
class MaskIcon extends Component {
    constructor(props) {
        super(props);
        this.maskClickHandler = this.maskClickHandler.bind(this);
        this.unMaskClickHandler = this.unMaskClickHandler.bind(this);
    }

    maskClickHandler() {
        this.props.onMask(this.props.maskPath);
    }

    unMaskClickHandler(){
        this.props.onUnMask(this.props.maskPath);
    }

    render() {
        return (
            this.props.enableMask ?
                <div className="mask-container">
                    {this.props.isMasked ?
                        <span className="mask-icon" onClick={this.unMaskClickHandler}>
                            <span className="unmask-png"></span>
                            <span className="mask-title">Unmask Data</span>
                        </span>
                        :
                        <span className="mask-icon" onClick={this.maskClickHandler}>
                            <span className="mask-png"></span>
                            <span className="mask-title">Mask Data</span>
                        </span>
                    }
                </div>
            : null
        )
    }
}

export default MaskIcon
