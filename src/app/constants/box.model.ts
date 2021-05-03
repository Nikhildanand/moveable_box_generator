interface InsetStyle {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

export type CustomStyle = CSSStyleDeclaration | InsetStyle;
