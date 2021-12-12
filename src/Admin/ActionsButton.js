import React from 'react'
import { Button } from "react-bootstrap"

function ActionsButton({ onClick, size, variant, title }) {

    return (
        <Button
            className="m-1"
            size={size}
            variant={variant}
            onClick={onClick}>
            {title}
        </Button>
    )
}

export default ActionsButton
