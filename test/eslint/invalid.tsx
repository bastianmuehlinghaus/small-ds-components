// 6 violations in all: collisionPadding counts one per literal.
export const Attribute = () => <Menu sideOffset={4} />; // 1
export const AlignAttribute = () => <Menu alignOffset={-1} />; // 2
export const Padding = () => <Menu collisionPadding={{ top: 8, left: 8 }} />; // 3, 4 (one per literal)
export const Default = ({ sideOffset = 4 }: { sideOffset?: number }) => <Menu sideOffset={sideOffset} />; // 5
export const ObjectKey = () => useMenu({ arrowPadding: 6 }); // 6
