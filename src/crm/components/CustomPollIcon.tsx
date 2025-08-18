import * as React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export default function CustomPollIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Poll chart bars */}
      <rect x="3" y="15" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="7.5" y="11" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="12" y="8" width="3" height="13" rx="1" fill="currentColor" />
      <rect x="16.5" y="13" width="3" height="8" rx="1" fill="currentColor" />
      
      {/* Vote/checkbox symbols */}
      <circle cx="4.5" cy="4" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="9" cy="4" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="13.5" cy="4" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="18" cy="4" r="1.5" fill="currentColor" opacity="0.7" />
      
      {/* Check marks */}
      <path d="M3.5 4 L4 4.5 L5.5 3" stroke="white" strokeWidth="0.5" fill="none" />
      <path d="M12.5 4 L13 4.5 L14.5 3" stroke="white" strokeWidth="0.5" fill="none" />
    </SvgIcon>
  );
}
