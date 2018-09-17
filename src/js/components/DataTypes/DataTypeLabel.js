import React from "react"

//theme
import Theme from "./../../themes/getStyle"

export default class extends React.Component {
    render() {
        const { rjvId, type_name, displayDataTypes, theme } = this.props
        if (displayDataTypes) {
            return (
                <span
                    class="data-type-label"
                    {...Theme(theme, "data-type-label")}
                >
                    <span className="data-type-int">{type_name}</span>
                </span>
            )
        } else {
            return null
        }
    }
}
