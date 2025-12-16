
import React from 'react';
import { Stack } from 'expo-router';
import IOSTabBar from '@/components/IOSTabBar';

export default function TabLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
        }}
      >
        <Stack.Screen 
          name="input" 
          options={{
            title: 'Input',
          }}
        />
        <Stack.Screen 
          name="history" 
          options={{
            title: 'History',
          }}
        />
      </Stack>
      <IOSTabBar />
    </>
  );
}
