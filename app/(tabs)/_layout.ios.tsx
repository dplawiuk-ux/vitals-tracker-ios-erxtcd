
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="input" name="input">
        <Icon sf="plus.circle.fill" />
        <Label>Input</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="history" name="history">
        <Icon sf="clock.fill" />
        <Label>History</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Screen key="metric-detail" name="metric-detail" options={{ href: null }} />
    </NativeTabs>
  );
}
