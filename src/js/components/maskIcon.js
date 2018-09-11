import React, { Component } from 'react'
import _ from 'lodash';
class MaskIcon extends Component {
    constructor(props) {
        super(props);

        this.maskClickHandler = this.maskClickHandler.bind(this);
        this.unMaskClickHandler = this.unMaskClickHandler.bind(this);
        this.findMask = this.findMask.bind(this);
    }

    maskClickHandler() {

        // console.log("this.props",this.props.masked, this.props.maskData);
        this.props.onMask(this.props.masked);
        // this.findMask()
    }

    unMaskClickHandler(){
        this.props.onUnMask(this.props.masked);
    }

    findMask(maskData) {

        var maskData = this.props.maskData;
        // var d = _.map(maskData, (obj) => {
        //     console.log("d", data);
        //     // return data
        // })
        // var data = _.find(maskData, this.props.mask);

        // console.log("data",data);


        // Object.keys(maskData).map((key) => {
        //     var result = []
        //     var objKey = maskData[key];
        //     console.log("objKey", objKey)
        //     if(typeof objKey === "object") {
        //         console.log("test");
        //         result.push([key])
        //         if(typeof objKey == "object" && Array.isArray(objKey)) {  
        //             console.log("dsdsasda");  
        //             maskData[key].map((obj) => {
        //                     result.push([objKey,"[]", obj])
        //                 })
        //         }
        //         // this.findMask(maskData);
        //     } 



        //console.log("result", result);
        //})

    }

    render() {
        return (
            <div className="mask-container">
                {this.props.isMasked ?
                    <span className="mask-icon" onClick={this.unMaskClickHandler}>Unmask</span>
                    :
                    <span className="mask-icon" onClick={this.maskClickHandler}>Mask</span>
                }
            </div>
        )
    }
}

export default MaskIcon
