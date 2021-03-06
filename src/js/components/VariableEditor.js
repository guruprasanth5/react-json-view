import React from "react"
import AutosizeTextarea from "react-textarea-autosize"

import { toType } from "./../helpers/util"
import dispatcher from "./../helpers/dispatcher"
import parseInput from "./../helpers/parseInput"
import {includes} from "./../helpers/util"
import stringifyVariable from "./../helpers/stringifyVariable"
import CopyToClipboard from "./CopyToClipboard"
import MaskIcon from './maskIcon';

//data type components
import {
    JsonBoolean,
    JsonDate,
    JsonFloat,
    JsonFunction,
    JsonInteger,
    JsonNan,
    JsonNull,
    JsonRegexp,
    JsonString,
    JsonUndefined
} from "./DataTypes/DataTypes"

//clibboard icon
import { Edit, CheckCircle, RemoveCircle as Remove } from "./icons"

//theme
import Theme from "./../themes/getStyle"

class VariableEditor extends React.Component {
    state = {
        editMode: false,
        editValue: "",
        renameKey: false,
        toggle:false,
        parsedInput: {
            type: false,
            value: null
        }

    }

    render() {
        const {
            variable,
            src,
            singleIndent,
            type,
            theme,
            namespace,
            indentWidth,
            enableClipboard,
            enableCopyPath,
            enableMask,
            enableEllipsis,
            onEdit,
            onDelete,
            onSelect,
            onMask,
            onUnMask,
            rjvId,
            maskData,
            maskPath,
        } = this.props
        const { editMode } = this.state
        let isMasked = includes(maskData,maskPath)
        return (
            <div
                {...Theme(theme, "objectKeyVal", {
                    paddingLeft: indentWidth * singleIndent
                })}
                class={isMasked ? "variable-row active":"variable-row"}
                key={variable.name}
            >
                {type == "array" ? (
                    <span
                        {...Theme(theme, "array-key")}
                        key={variable.name + "_" + namespace}
                    >
                        {variable.name}
                        <div {...Theme(theme, "colon")}>:</div>
                    </span>
                ) : (
                        <span>
                            <span
                                {...Theme(theme, "object-name")}
                                class="object-key"
                                key={variable.name + "_" + namespace}
                            >
                                <span style={{ verticalAlign: "top" }}>"</span>
                                <span style={{ display: "inline-block" }}>
                                    {variable.name}
                                </span>
                                <span style={{ verticalAlign: "top" }}>"</span>
                            </span>
                            <span {...Theme(theme, "colon")}>:</span>
                        </span>
                    )}
                <div
                    class={isMasked ? "variable-value active":"variable-value"}
                    onClick={
                        onSelect === false && onEdit === false
                            ? null
                            : e => {
                                let location = [...namespace]
                                if ((e.ctrlKey || e.metaKey) && onEdit !== false) {
                                    this.prepopInput(variable)
                                } else if (onSelect !== false) {
                                    location.shift()
                                    onSelect({
                                        ...variable,
                                        namespace: location
                                    })
                                }
                            }
                    }
                    {...Theme(theme, "variableValue", {
                        cursor: onSelect === false ? "default" : "pointer"
                    })}
                >
                    {this.getValue(variable, editMode)}
                </div>
                {enableEllipsis ? 
                    <div className="vertical-align" onClick={() => {
                        this.setState({toggle:!this.state.toggle})
                    }}>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAgCAYAAAArBentAAAAAXNSR0IArs4c6QAAANFJREFUOBFjZICChv75Agx/vrf9Y/jvwfCfgY+BkfEECzNzZV1R+mWQEkYQ0d29iPvz/y/nGRj+q4L4MMDIwPiLmZHZrq40/SQTSPArw+dydEUg8f8M/9n+/v8zDcQGK/z3n9EBxMEG/jMyGnbMnMkPVohNAboYWCET4/8D6BIwPuP//+cr0tM/ghVyM/B2Av11GyYJoyGeYckC8cEKS0vjvjKxcpoxMTJOB4bDfaD4W2BwbGNmYTYB+RimcbDT4CgEOXI0rmFRNRrXo/kab74GAGE2nzSKLEH+AAAAAElFTkSuQmCC" style={{"width":"6px","height":"17px","cursor":"pointer"}}/>
                    {this.state.toggle ? 
                        <span className="edit-icons-json">
                            {enableClipboard ? 
                                <CopyToClipboard
                                    hidden={editMode}
                                    src={variable.value}
                                    clickCallback={enableClipboard}
                                    copyType="value"
                                    name="Copy Value"
                                    {...{ theme, namespace }}
                                />
                            : null}

                            {enableCopyPath ?
                                <CopyToClipboard
                                    hidden={editMode}
                                    src={this.props.path.join('.')}
                                    copyType="path"
                                    name="Copy Path"
                                    clickCallback={enableCopyPath}
                                    {...{ theme, namespace }}
                                />
                                :
                                null}
                                {enableMask ?
                                    <MaskIcon {...this.props} isMasked={isMasked}/>
                     
                                    : null}
                            </span>
                    :null}
                    </div>
                : null}
                {this.state.toggle ? <div className="element-div" onClick = {() => {
                    this.setState({
                        toggle:false
                    })
                }}></div>:null}
                {/* {enableClipboard ? (
                    <CopyToClipboard
                        hidden={editMode}
                        src={variable.value}
                        clickCallback={enableClipboard}
                        copyType="value"
                        {...{ theme, namespace }}
                    />
                ) : null}
                {enableCopyPath ?
                    <CopyToClipboard
                        hidden={editMode}
                        src={this.props.path.join('.')}
                        copyType="path"
                        clickCallback={enableCopyPath}
                        {...{ theme, namespace }}
                    />
                    :
                    null}
                {enableMask ?
                    <MaskIcon {...this.props}/>
                    // <CopyToClipboard
                    //     hidden={editMode}
                    //     src={this.props.path.join('.')}
                    //     copyType="path"
                    //     clickCallback={enableCopyPath}
                    //     {...{ theme, namespace }}
                    // /> 
                : null} */}
                {onEdit !== false && editMode == false
                    ? this.getEditIcon()
                    : null}
                {onDelete !== false && editMode == false
                    ? this.getRemoveIcon()
                    : null}
            </div>
        )
    }

    getEditIcon = () => {
        const { variable, theme } = this.props

        return (
            <div class="click-to-edit" style={{ verticalAlign: "top" }}>
                <Edit
                    class="click-to-edit-icon"
                    {...Theme(theme, "editVarIcon")}
                    onClick={() => {
                        this.prepopInput(variable)
                    }}
                />
            </div>
        )
    }

    prepopInput = variable => {
        let detected
        if (this.props.onEdit !== false) {
            this.state.editMode = true
            this.state.editValue = stringifyVariable(variable.value)
            detected = parseInput(this.state.editValue)
            this.state.parsedInput = {
                type: detected.type,
                value: detected.value
            }
            this.setState(this.state)
        }
    }

    getRemoveIcon = () => {
        const { variable, namespace, theme, rjvId } = this.props

        return (
            <div class="click-to-remove" style={{ verticalAlign: "top" }}>
                <Remove
                    class="click-to-remove-icon"
                    {...Theme(theme, "removeVarIcon")}
                    onClick={() => {
                        dispatcher.dispatch({
                            name: "VARIABLE_REMOVED",
                            rjvId: rjvId,
                            data: {
                                name: variable.name,
                                namespace: namespace,
                                existing_value: variable.value,
                                variable_removed: true
                            }
                        })
                    }}
                />
            </div>
        )
    }

    getValue = (variable, editMode) => {
        const type = editMode ? false : variable.type
        const { props } = this
        switch (type) {
            case false:
                return this.getEditInput()
            case "string":
                return <JsonString value={variable.value} {...props} />
            case "integer":
                return <JsonInteger value={variable.value} {...props} />
            case "float":
                return <JsonFloat value={variable.value} {...props} />
            case "boolean":
                return <JsonBoolean value={variable.value} {...props} />
            case "function":
                return <JsonFunction value={variable.value} {...props} />
            case "null":
                return <JsonNull {...props} />
            case "nan":
                return <JsonNan {...props} />
            case "undefined":
                return <JsonUndefined {...props} />
            case "date":
                return <JsonDate value={variable.value} {...props} />
            case "regexp":
                return <JsonRegexp value={variable.value} {...props} />
            default:
                // catch-all for types that weren't anticipated
                return (
                    <div class="object-value">
                        {JSON.stringify(variable.value)}
                    </div>
                )
        }
    }

    getEditInput = () => {
        const { theme } = this.props
        const { editValue } = this.state

        return (
            <div>
                <AutosizeTextarea
                    type="text"
                    inputRef={input => input && input.focus()}
                    value={editValue}
                    class="variable-editor"
                    onChange={event => {
                        const value = event.target.value
                        const detected = parseInput(value)
                        this.setState({
                            editValue: value,
                            parsedInput: {
                                type: detected.type,
                                value: detected.value
                            }
                        })
                    }}
                    onKeyDown={e => {
                        switch (e.key) {
                            case "Escape": {
                                this.setState({
                                    editMode: false,
                                    editValue: ""
                                })
                                break
                            }
                            case "Enter": {
                                if (e.ctrlKey || e.metaKey) {
                                    this.submitEdit(true)
                                }
                                break
                            }
                        }
                        e.stopPropagation()
                    }}
                    placeholder="update this value"
                    {...Theme(theme, "edit-input")}
                />
                <div {...Theme(theme, "edit-icon-container")}>
                    <Remove
                        class="edit-cancel"
                        {...Theme(theme, "cancel-icon")}
                        onClick={() => {
                            this.setState({ editMode: false, editValue: "" })
                        }}
                    />
                    <CheckCircle
                        class="edit-check string-value"
                        {...Theme(theme, "check-icon")}
                        onClick={() => {
                            this.submitEdit()
                        }}
                    />
                    <div>{this.showDetected()}</div>
                </div>
            </div>
        )
    }

    submitEdit = submit_detected => {
        const { variable, namespace, rjvId } = this.props
        const { editValue, parsedInput } = this.state
        let new_value = editValue
        if (submit_detected && parsedInput.type) {
            new_value = parsedInput.value
        }
        this.state.editMode = false
        dispatcher.dispatch({
            name: "VARIABLE_UPDATED",
            rjvId: rjvId,
            data: {
                name: variable.name,
                namespace: namespace,
                existing_value: variable.value,
                new_value: new_value,
                variable_removed: false
            }
        })
    }

    showDetected = () => {
        const { theme, variable, namespace, rjvId } = this.props
        const { type, value } = this.state.parsedInput
        const detected = this.getDetectedInput()
        if (detected) {
            return (
                <div>
                    <div {...Theme(theme, "detected-row")}>
                        {detected}
                        <CheckCircle
                            class="edit-check detected"
                            style={{
                                verticalAlign: "top",
                                paddingLeft: "3px",
                                ...Theme(theme, "check-icon").style
                            }}
                            onClick={() => {
                                this.submitEdit(true)
                            }}
                        />
                    </div>
                </div>
            )
        }
    }

    getDetectedInput = () => {
        const { parsedInput } = this.state
        const { type, value } = parsedInput
        const { props } = this
        const { theme } = this.props

        if (type !== false) {
            switch (type.toLowerCase()) {
                case "object":
                    return (
                        <span>
                            <span
                                style={{
                                    ...Theme(theme, "brace").style,
                                    cursor: "default"
                                }}
                            >
                                {"{"}
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, "ellipsis").style,
                                    cursor: "default"
                                }}
                            >
                                ...
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, "brace").style,
                                    cursor: "default"
                                }}
                            >
                                {"}"}
                            </span>
                        </span>
                    )
                case "array":
                    return (
                        <span>
                            <span
                                style={{
                                    ...Theme(theme, "brace").style,
                                    cursor: "default"
                                }}
                            >
                                {"["}
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, "ellipsis").style,
                                    cursor: "default"
                                }}
                            >
                                ...
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, "brace").style,
                                    cursor: "default"
                                }}
                            >
                                {"]"}
                            </span>
                        </span>
                    )
                case "string":
                    return <JsonString value={value} {...props} />
                case "integer":
                    return <JsonInteger value={value} {...props} />
                case "float":
                    return <JsonFloat value={value} {...props} />
                case "boolean":
                    return <JsonBoolean value={value} {...props} />
                case "function":
                    return <JsonFunction value={value} {...props} />
                case "null":
                    return <JsonNull {...props} />
                case "nan":
                    return <JsonNan {...props} />
                case "undefined":
                    return <JsonUndefined {...props} />
                case "date":
                    return <JsonDate value={new Date(value)} {...props} />
            }
        }
    }
}

//export component
export default VariableEditor
