import type React from 'react'

/**
 * Remove properties `K` from `T`.
 * Distributive for union types.
 */
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

/**
 * A component whose root component can be controlled via a `as` prop.
 *
 * Adjusts valid props based on the type of `as`.
 */
interface OverridableComponent<M extends OverridableTypeMap> {
  // If you make any changes to this interface, please make sure to update the
  // `OverridableComponent` type in `mui-material/src/OverridableComponent.d.ts` as well.
  // Also, there are types in Base UI that have a similar shape to this interface
  // (e.g. SelectType, OptionType, etc.).
  <C extends React.ElementType>(
    props: {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      as: C;
    } & OverrideProps<M, C>,
  ): JSX.Element | null;
  (props: DefaultComponentProps<M>): JSX.Element | null;
  propTypes?: any;
}

/**
 * Props of the component if `as={Component}` is used.
 */
type OverrideProps<
  M extends OverridableTypeMap,
  C extends React.ElementType
> = (
  & BaseProps<M>
  & DistributiveOmit<React.ComponentPropsWithRef<C>, keyof BaseProps<M>>
);

/**
 * Props if `as={Component}` is NOT used.
 */
type DefaultComponentProps<M extends OverridableTypeMap> =
  & BaseProps<M>
  & DistributiveOmit<React.ComponentPropsWithRef<M['defaultComponent']>, keyof BaseProps<M>>;

/**
 * Props defined on the component.
 */
type BaseProps<M extends OverridableTypeMap> = M['props'];

interface OverridableTypeMap {
  props: {};
  defaultComponent: React.ElementType;
}

interface RippleProps {
  disableRipple?: boolean;
  focusRipple?: boolean;
  centerRipple?: boolean;
  disabledClassName?: string;
  focusVisibleClassName?: string;
  style?: React.CSSProperties;
  onFocusVisible?: React.FocusEventHandler<HTMLElement>;
  ref?: React.ForwardedRef<unknown>;
}

declare const Ripple: OverridableComponent<{
  props: RippleProps;
  defaultComponent: 'button';
}>;

export {
  Ripple,
  RippleProps,
}
