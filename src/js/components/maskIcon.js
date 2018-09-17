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
                        <span className="mask-icon" onClick={this.unMaskClickHandler}>Unmask</span>
                        :
                        <span className="mask-icon" onClick={this.maskClickHandler}>Mask</span>
                    }
                </div>
            : null
        )
    }
}

export default MaskIcon
