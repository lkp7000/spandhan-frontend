import { Select, SelectProps } from '@/components/ui/Select'
import type { MouseEvent, ReactNode } from 'react'

interface RoleProps extends SelectProps {
    onRoleChange?: (role: string) => void
}

const Role = (props: RoleProps) => {
    const { onRoleChange, ...rest } = props

    const handleRoleChange = (value: string) => {
        onRoleChange?.(value)
    }

    return (
        <Select
            {...rest}
            onChange={handleRoleChange}
        >
           <option value="Doctor">Doctor</option>
            <option value="Plan">Plan</option>
            <option value="Auth">Auth</option>
        </Select>
    )
}

export default Role
