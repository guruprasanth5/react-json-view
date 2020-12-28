import React from "react"

import { toType } from "./../helpers/util"
import stringifyVariable from "./../helpers/stringifyVariable"

//clibboard icon
import { Clippy } from "./icons"

//theme
import Theme from "./../themes/getStyle"

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.copiedTimer = null
    }

    state = { copied: false }

    componentWillUnmount() {
        if (this.copiedTimer) {
            clearTimeout(this.copiedTimer)
            this.copiedTimer = null
        }
    }

    handleCopy = () => {
        const container = document.createElement("textarea")
        const { clickCallback, src, namespace } = this.props

        container.innerHTML = typeof(src) !== 'string' ? JSON.stringify(
            this.clipboardValue(src),
            null,
            "  "
        ) : this.clipboardValue(src)

        document.body.appendChild(container)
        container.select()
        document.execCommand("copy")

        document.body.removeChild(container)

        this.copiedTimer = setTimeout(() => {
            this.setState({
                copied: false
            })
        }, 5500)

        this.setState({ copied: true }, () => {
            if (typeof clickCallback !== "function") {
                return
            }

            clickCallback({
                src: src,
                namespace: namespace,
                name: namespace[namespace.length - 1]
            })
        })
    }

    getClippyIcon = () => {
        const { theme } = this.props

        if (this.state.copied) {
            return (
                <span>
                    <Clippy class={"copy-icon "+ this.props.copyType} {...Theme(theme, "copy-icon")} copyType={this.props.copyType} name={this.props.name} />
                    {/* {this.props.name === "copy" ? <span className="copy-text">Copy</span>:<span className="path-text">Path</span>} */}
                    <span {...Theme(theme, "copy-icon-copied")}>✔</span>
                </span>
            )
        }

        return <Clippy class={"copy-icon "+ this.props.copyType} {...Theme(theme, "copy-icon")} copyType={this.props.copyType}/>
    }

    clipboardValue = value => {
        const type = toType(value)
        switch (type) {
            case "function":
                return value.toString()
            case "regexp":
                return value.toString()
            default:
                return value
        }
    }

    render() {
        const { src, theme, hidden } = this.props
        let style = Theme(theme, "copy-to-clipboard").style
        let display = "inline"

        if (hidden) {
            display = "none"
        }

        return (
            <span class="copy-to-clipboard-container">
                <span
                    style={{
                        ...style,
                        display: display
                    }}
                    onClick={this.handleCopy}
                >
                    {this.getClippyIcon()}
                </span>
            </span>
        )
    }
}
