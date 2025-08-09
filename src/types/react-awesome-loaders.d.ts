declare module 'react-awesome-loaders' {
  import { ReactNode } from 'react';

  export interface LoaderProps {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }

  export const BoxesLoader: React.FC<LoaderProps>;
} 