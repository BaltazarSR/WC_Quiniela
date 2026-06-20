interface IconProps {
  color?: string
  size?: number
  style?: React.CSSProperties
}

export function SoccerIcon({ color = 'white', size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0, ...style }}>
      <path d="M13.8105 13.7979H10.1855L9.20654 10.8609L11.9985 8.99988L14.7895 10.8609L13.8105 13.7979Z" fill="currentColor" />
      <path d="M11.998 2C6.4752 2 1.99805 6.47715 1.99805 12C1.99805 17.5228 6.4752 22 11.998 22C17.5209 22 21.998 17.5228 21.998 12C21.998 6.47715 17.5209 2 11.998 2ZM8.91017 4.6177C8.93351 4.64459 8.95916 4.66979 8.98702 4.69298L11.57 6.84598C11.694 6.94798 11.846 6.99998 11.998 6.99998C12.15 6.99998 12.302 6.94798 12.426 6.84598L15.009 4.69298C15.0369 4.66979 15.0625 4.64458 15.0859 4.61768C16.1615 5.06811 17.1178 5.74674 17.8943 6.59304L16.4294 9.52287C16.2584 9.86387 16.3614 10.2779 16.6714 10.4999L19.7394 12.6909C19.8073 12.739 19.8813 12.7756 19.9586 12.8C19.8437 13.9569 19.4823 15.0414 18.9277 16.0001H15.2939C14.9699 16.0001 14.6869 16.2211 14.6079 16.5361L13.7914 19.7982C13.2149 19.9302 12.6146 20 11.998 20C11.3811 20 10.7805 19.9302 10.2036 19.798L9.38817 16.5361C9.30917 16.2211 9.02617 16.0001 8.70217 16.0001H5.06838C4.5138 15.0415 4.15245 13.9571 4.03756 12.8001C4.11454 12.7759 4.18835 12.7394 4.25605 12.6909L7.32405 10.4999C7.63505 10.2779 7.73805 9.86389 7.56705 9.52289L6.10232 6.59249C6.87871 5.74646 7.83483 5.06803 8.91017 4.6177Z" fill="currentColor" />
    </svg>
  )
}

export function PinIcon({ color = '#ef4444', size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0, ...style }}>
      <path d="M11.998 4C10.3412 4 8.99805 5.34315 8.99805 7C8.99805 8.65685 10.3412 10 11.998 10C13.6549 10 14.998 8.65685 14.998 7C14.998 5.34315 13.6549 4 11.998 4ZM6.99805 7C6.99805 4.23858 9.23662 2 11.998 2C14.7595 2 16.998 4.23858 16.998 7C16.998 9.41896 15.2803 11.4367 12.998 11.9V22H10.998V11.9C8.71581 11.4367 6.99805 9.41896 6.99805 7Z" fill="currentColor" />
    </svg>
  )
}

export function LockIcon({ color = 'white', size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0, ...style }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M20 10V21.9881H4V10H20ZM18 19.9881V11.9286H6V19.9881H18Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 4C10.3431 4 9 5.34315 9 7V10H7V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10H15V7C15 5.34315 13.6569 4 12 4Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M11 14H13V18H11V14Z" fill="currentColor" />
    </svg>
  )
}

export function CloseIcon({ color = 'white', size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0, ...style }}>
      <path d="M10.5838 12L4.92688 6.34311L6.34109 4.92889L11.998 10.5858L17.6549 4.92889L19.0691 6.34311L13.4122 12L19.069 17.6568L17.6548 19.071L11.998 13.4142L6.3412 19.071L4.92699 17.6568L10.5838 12Z" fill="currentColor" />
    </svg>
  )
}

export function CheckIcon({ color = 'white', size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0, ...style }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M21.2054 6.70712L8.99824 18.9142L2.29114 12.2071L3.70535 10.7929L8.99824 16.0858L19.7911 5.29291L21.2054 6.70712Z" fill="currentColor" />
    </svg>
  )
}

export function ChevronDownIcon({ color = 'white', size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0, ...style }}>
      <path d="M11.9981 13.5859L6.70523 8.29297L5.29102 9.70718L11.9981 16.4143L18.7052 9.70718L17.291 8.29297L11.9981 13.5859Z" fill="currentColor" />
    </svg>
  )
}
