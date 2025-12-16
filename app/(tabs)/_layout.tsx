
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
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="input" 
          options={{
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="history" 
          options={{
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="metric-detail" 
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
