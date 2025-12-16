
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IOSTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      name: 'input',
      route: '/(tabs)/input',
      iosIcon: 'plus.circle.fill',
      androidIcon: 'add-circle',
      label: 'Input',
    },
    {
      name: 'history',
      route: '/(tabs)/history',
      iosIcon: 'clock.fill',
      androidIcon: 'history',
      label: 'History',
    },
  ];

  // Don't show tab bar on screens outside the tabs group
  if (!pathname.startsWith('/(tabs)')) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.dark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderTopColor: theme.dark ? 'rgba(84, 84, 88, 0.65)' : 'rgba(0, 0, 0, 0.1)',
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.route || pathname.endsWith(`/${tab.name}`);
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
          >
            <IconSymbol
              ios_icon_name={tab.iosIcon}
              android_material_icon_name={tab.androidIcon}
              size={28}
              color={isActive ? '#007AFF' : (theme.dark ? '#8E8E93' : '#8E8E93')}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? '#007AFF' : (theme.dark ? '#8E8E93' : '#8E8E93'),
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
});
