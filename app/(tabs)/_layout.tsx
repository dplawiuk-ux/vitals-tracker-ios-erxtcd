
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: 'input',
      route: '/(tabs)/input',
      icon: 'add-circle',
      label: 'Input',
    },
    {
      name: 'history',
      route: '/(tabs)/history',
      icon: 'history',
      label: 'History',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="input" name="input" />
        <Stack.Screen key="history" name="history" />
        <Stack.Screen key="metric-detail" name="metric-detail" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
