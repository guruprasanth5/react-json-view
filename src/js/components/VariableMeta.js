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
            maskPath,
            maskData
        } = this.props;
        let isMasked = includes(maskData,maskPath)
        return (
            <div {...Theme(theme, 'object-meta-data')}
                class='object-meta-data'
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                {isMasked ? <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAcCAYAAABh2p9gAAAAAXNSR0IArs4c6QAAAnxJREFUSA2dlT+IE0EUxt1Ndis5SKOgoFYH/skmJEVAPXMed5Ugdop/ELS0FGy00MJCLAQRweJQOIVDS1ELD+FEsJDEJNvKKVYGUmoQ9pL1925vlkl2JyZ58O28ee97X97M7kysHQYrlUpeEATXSC+CveA38G3bXmk0Gk8tywqZJ8xKRAjk8/k7FNwMwzCTlie25rru1Vqt9nM4nxBE7Aake0JEtMuwBupgFz8wz3gIiG2Q91qt1p9oGj0HOigWiwcIvwQOZN9xnCWW96jdbq+Dt9Vq9Umn0wnIL4AcnBzxN/ixDXToed4qXZwl+xcc9n1/I2ZqDrxn8C4TCvnR2Xq9/k2lbeWUy2UH0imZs/HLJrHt/G0ZMavX652O3OgZC5KQN7lTwgh/idLpT7bhB5mtFwL3oM6KBUnkVAL/u/JNI/v3S3JwZ3SOLhjvJ0vu6ySDrzhxnfBiQUPRqHBPknQ6oJGVYKVSmel2u1XxxVjGmUKhcCSapT/7/f7ube5+OVW86ZbMLQpnSb7H3yeBaY1O7/KR37L4pj7Q0clphfS6TCZzTJY8J0F+YZVBjtnERkOPKXL59I5nmWztI4HPtLw8sRoFrPIhOi5NOQNvaBqx4ZppBOVCWQH3h8VkPqmgiL0AF8EekLBJBEXsOZDb6BWQ2yZhJsEizKMaW4mdIyb35XmwqeVj1yQoncjHvgCGxS4QSxUjbtzDS+Tkkn0N3gHV2UgxeEbBr+QWgYguAVnmf8XgGAUlp0Qf4Bv3TIi6qVOix3RfRAVjW5bjsinHD8xzhEwvaaSgOr6Mgdw26zgnRlaMmeSmn7P5G7xClx+l0zHr0mhtxK43m81P/wBHXtlsurFCsgAAAABJRU5ErkJggg=="  style={{"width":"10px","margin-right": "5px", "position": "relative","top": "2px"}}/> : null}

                {/* size badge display */}
                {this.getObjectSize()}
                {/* copy to clipboard icon */}
                <div className="vertical-align" onClick={() => {
                        this.setState({toggle:!this.state.toggle})
                    }}>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAgCAYAAAArBentAAAAAXNSR0IArs4c6QAAANFJREFUOBFjZICChv75Agx/vrf9Y/jvwfCfgY+BkfEECzNzZV1R+mWQEkYQ0d29iPvz/y/nGRj+q4L4MMDIwPiLmZHZrq40/SQTSPArw+dydEUg8f8M/9n+/v8zDcQGK/z3n9EBxMEG/jMyGnbMnMkPVohNAboYWCET4/8D6BIwPuP//+cr0tM/ghVyM/B2Av11GyYJoyGeYckC8cEKS0vjvjKxcpoxMTJOB4bDfaD4W2BwbGNmYTYB+RimcbDT4CgEOXI0rmFRNRrXo/kab74GAGE2nzSKLEH+AAAAAElFTkSuQmCC" style={{"width":"6px","height":"17px","cursor":"pointer", "position":"relative", "top":"3px"}}/>
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