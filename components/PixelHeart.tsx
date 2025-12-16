
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PixelHeartProps {
  size?: number;
  color?: string;
}

export const PixelHeart: React.FC<PixelHeartProps> = ({ 
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
      {/* Top left bump */}
      <Pixel row={2} col={2} />
      <Pixel row={2} col={3} />
      <Pixel row={1} col={3} />
      <Pixel row={1} col={4} />
      <Pixel row={2} col={4} />
      
      {/* Top right bump */}
      <Pixel row={2} col={7} />
      <Pixel row={2} col={8} />
      <Pixel row={1} col={7} />
      <Pixel row={1} col={8} />
      <Pixel row={2} col={9} />
      
      {/* Upper middle section */}
      <Pixel row={3} col={1} />
      <Pixel row={3} col={2} />
      <Pixel row={3} col={3} />
      <Pixel row={3} col={4} />
      <Pixel row={3} col={5} />
      <Pixel row={3} col={6} />
      <Pixel row={3} col={7} />
      <Pixel row={3} col={8} />
      <Pixel row={3} col={9} />
      <Pixel row={3} col={10} />
      
      {/* Middle section */}
      <Pixel row={4} col={1} />
      <Pixel row={4} col={2} />
      <Pixel row={4} col={3} />
      <Pixel row={4} col={4} />
      <Pixel row={4} col={5} />
      <Pixel row={4} col={6} />
      <Pixel row={4} col={7} />
      <Pixel row={4} col={8} />
      <Pixel row={4} col={9} />
      <Pixel row={4} col={10} />
      
      <Pixel row={5} col={1} />
      <Pixel row={5} col={2} />
      <Pixel row={5} col={3} />
      <Pixel row={5} col={4} />
      <Pixel row={5} col={5} />
      <Pixel row={5} col={6} />
      <Pixel row={5} col={7} />
      <Pixel row={5} col={8} />
      <Pixel row={5} col={9} />
      <Pixel row={5} col={10} />
      
      {/* Lower middle section */}
      <Pixel row={6} col={2} />
      <Pixel row={6} col={3} />
      <Pixel row={6} col={4} />
      <Pixel row={6} col={5} />
      <Pixel row={6} col={6} />
      <Pixel row={6} col={7} />
      <Pixel row={6} col={8} />
      <Pixel row={6} col={9} />
      
      <Pixel row={7} col={3} />
      <Pixel row={7} col={4} />
      <Pixel row={7} col={5} />
      <Pixel row={7} col={6} />
      <Pixel row={7} col={7} />
      <Pixel row={7} col={8} />
      
      {/* Bottom section */}
      <Pixel row={8} col={4} />
      <Pixel row={8} col={5} />
      <Pixel row={8} col={6} />
      <Pixel row={8} col={7} />
      
      <Pixel row={9} col={5} />
      <Pixel row={9} col={6} />
      
      {/* Bottom point */}
      <Pixel row={10} col={5} />
      <Pixel row={10} col={6} />
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
