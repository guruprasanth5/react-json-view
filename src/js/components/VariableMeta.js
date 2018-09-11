import React from 'react';
import dispatcher from './../helpers/dispatcher';

import CopyToClipboard from './CopyToClipboard'
import { toType } from './../helpers/util';
import MaskIcon from '../components/maskIcon';
import {includes} from "./../helpers/util"

//icons
import {
    RemoveCircle as Remove, AddCircle as Add
} from './icons';

//theme
import Theme from './../themes/getStyle';


export default class extends React.Component {

    state = {
        toggle:false
    }

    getObjectSize = () => {
        const { size, theme, displayObjectSize } = this.props;
        if (displayObjectSize) {
            return (
                <span class="object-size"
                    {...Theme(theme, 'object-size')}>
                    {size} item{size == 1 ? '' : 's'}
                </span>
            );
        }
    }

    getAddAttribute = () => {
        const {
            theme, namespace, name, src, rjvId, depth
        } = this.props;

        return (
            <span
                class="click-to-add"
                style={{ verticalAlign: 'top' }}>
                <Add
                    class="click-to-add-icon"
                    {...Theme(theme, 'addVarIcon')}
                    onClick={() => {
                        const request = {
                            name: depth > 0 ? name : null,
                            namespace: namespace.splice(
                                0, (namespace.length - 1)
                            ),
                            existing_value: src,
                            variable_removed: false,
                            key_name: null
                        };
                        if (toType(src) == 'object') {
                            dispatcher.dispatch({
                                name: 'ADD_VARIABLE_KEY_REQUEST',
                                rjvId: rjvId,
                                data: request,
                            });
                        } else {
                            dispatcher.dispatch({
                                name: 'VARIABLE_ADDED',
                                rjvId: rjvId,
                                data: {
                                    ...request,
                                    new_value: [...src, null]
                                }
                            });
                        }
                    }}
                />
            </span>
        );
    }

    getRemoveObject = () => {
        const {
            theme, hover, namespace, name, src, rjvId
        } = this.props;

        //don't allow deleting of root node
        if (namespace.length == 1) { return }

        return (
            <span class="click-to-remove" >
                <Remove
                    class="click-to-remove-icon"
                    {...Theme(theme, 'removeVarIcon')}
                    onClick={() => {
                        dispatcher.dispatch({
                            name: 'VARIABLE_REMOVED',
                            rjvId: rjvId,
                            data: {
                                name: name,
                                namespace: namespace.splice(0, (namespace.length - 1)),
                                existing_value: src,
                                variable_removed: true
                            },
                        });
                    }}
                />
            </span>
        );
    }

    render = () => {
        const {
            theme,
            onDelete,
            onAdd,
            enableClipboard,
            enableCopyPath,
            enableMask,
            src,
            namespace,
            path,
            masked,
            maskData
        } = this.props;
        let isMasked = includes(maskData,masked)
        return (
            <div {...Theme(theme, 'object-meta-data')}
                class='object-meta-data'
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                {/* size badge display */}
                {this.getObjectSize()}
                {/* copy to clipboard icon */}
                <div className="vertical-align" onClick={() => {
                        this.setState({toggle:!this.state.toggle})
                    }}>
                        <img src="https://www.shareicon.net/data/128x128/2015/10/17/657500_vertical_512x512.png" style={{"width":"20px","height":"17px"}}/>
                    {this.state.toggle ? 
                    <span className="edit-icons-json">
                        {enableClipboard
                            ? (<CopyToClipboard
                                clickCallback={enableClipboard}
                                copyType="value"
                                name="copy"
                                {...{ src, theme, namespace }} />)
                            : null
                        }
                        {enableCopyPath ?
                            <CopyToClipboard
                                clickCallback={enableClipboard}
                                copyType="path"
                                name="path"
                                {...{ theme, namespace }}
                                src={path.join('.')}/>
                            :
                            null}
                        {enableMask ? 
                             <MaskIcon {...this.props} isMasked={isMasked}/>
                        :null}
                        </span>
                    : null}
                    {this.state.toggle ? <div className="element-div" onClick = {() => {
                        this.setState({
                            toggle:false
                        })
                    }}></div>:null}
                </div>
                {/* copy add/remove icons */}
                {onAdd !== false ? this.getAddAttribute() : null}
                {onDelete !== false ? this.getRemoveObject() : null}
            </div>
        );
    }

}