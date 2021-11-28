import { SerializedStyles } from '@emotion/react'

export interface WithStylesOverrides<
  StylesKeys extends string | number = string
> {
  styles?: Partial<Record<StylesKeys, SerializedStyles>>
}
