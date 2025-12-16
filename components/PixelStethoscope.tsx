
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PixelStethoscopeProps {
  size?: number;
  color?: string;
}

export const PixelStethoscope: React.FC<PixelStethoscopeProps> = ({ 
  size = 120, 
  color = '#000000' 
}) => {
  const pixelSize = size / 12;

  const Pixel = ({ row, col }: { row: number; col: number }) => (
    <View
      style={[
        styles.pixel,
        {
          width: pixelSize,
          height: pixelSize,
          top: row * pixelSize,
          left: col * pixelSize,
          backgroundColor: color,
        },
      ]}
    />
  );

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Left earpiece */}
      <Pixel row={0} col={1} />
      <Pixel row={0} col={2} />
      <Pixel row={1} col={0} />
      <Pixel row={1} col={1} />
      <Pixel row={1} col={2} />
      <Pixel row={1} col={3} />
      <Pixel row={2} col={0} />
      <Pixel row={2} col={3} />
      
      {/* Right earpiece */}
      <Pixel row={0} col={9} />
      <Pixel row={0} col={10} />
      <Pixel row={1} col={8} />
      <Pixel row={1} col={9} />
      <Pixel row={1} col={10} />
      <Pixel row={1} col={11} />
      <Pixel row={2} col={8} />
      <Pixel row={2} col={11} />
      
      {/* Left tube */}
      <Pixel row={3} col={1} />
      <Pixel row={4} col={1} />
      <Pixel row={5} col={2} />
      <Pixel row={6} col={3} />
      <Pixel row={7} col={4} />
      
      {/* Right tube */}
      <Pixel row={3} col={10} />
      <Pixel row={4} col={10} />
      <Pixel row={5} col={9} />
      <Pixel row={6} col={8} />
      <Pixel row={7} col={7} />
      
      {/* Chest piece (diaphragm) */}
      <Pixel row={8} col={4} />
      <Pixel row={8} col={5} />
      <Pixel row={8} col={6} />
      <Pixel row={8} col={7} />
      <Pixel row={9} col={3} />
      <Pixel row={9} col={4} />
      <Pixel row={9} col={5} />
      <Pixel row={9} col={6} />
      <Pixel row={9} col={7} />
      <Pixel row={9} col={8} />
      <Pixel row={10} col={3} />
      <Pixel row={10} col={4} />
      <Pixel row={10} col={5} />
      <Pixel row={10} col={6} />
      <Pixel row={10} col={7} />
      <Pixel row={10} col={8} />
      <Pixel row={11} col={4} />
      <Pixel row={11} col={5} />
      <Pixel row={11} col={6} />
      <Pixel row={11} col={7} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  pixel: {
    position: 'absolute',
  },
});
