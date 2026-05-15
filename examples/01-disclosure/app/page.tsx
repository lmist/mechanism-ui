'use client';
import { useDisclosure } from '../hooks/useDisclosure';

export default function Demo() {
  const { triggerProps, contentProps } = useDisclosure();
  return <div><button {...triggerProps}>Toggle</button><div {...contentProps}>Content</div></div>;
}