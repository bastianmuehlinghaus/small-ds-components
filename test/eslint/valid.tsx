// None of these may be flagged.
import { tokenPx } from "../../src/tokenPx";

const OFFSET = tokenPx("sds-space-inline-xs");

export const FromToken = () => <Menu sideOffset={OFFSET} />;
export const FromTokenInline = () => <Menu alignOffset={tokenPx("sds-space-inline-xs")} />;
export const Zero = () => <Menu sideOffset={0} />;
export const NestedFromToken = () => <Menu collisionPadding={{ top: OFFSET, left: OFFSET }} />;
export const DefaultFromToken = ({ sideOffset = OFFSET }: { sideOffset?: number }) => <Menu sideOffset={sideOffset} />;
// Not dimension props, so a literal is fine.
export const OtherProps = () => <Menu tabIndex={4} avoidCollisions sticky="always" />;
