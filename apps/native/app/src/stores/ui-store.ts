import create, { State } from 'zustand/vanilla';
import { persist } from "zustand/middleware"
import createUse from 'zustand';
import AsyncStorage from '@react-native-community/async-storage';
import { EdgeInsets, Rect } from 'react-native-safe-area-context';

interface UIStore extends State {
  insets: EdgeInsets;
  frame: Rect;
  selectedTab: number;
  unselectedTab: number;
}

export const uiStore = create<UIStore>((set, get) => ({
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
  frame: { x: 0, y: 0, width: 0, height: 0 },
  selectedTab: 1,
  unselectedTab: 1,
}));

export const useUiStore = createUse(uiStore);
