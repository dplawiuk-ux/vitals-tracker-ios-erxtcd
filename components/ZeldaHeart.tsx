
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ZeldaHeartProps {
  size?: number;
}

export const ZeldaHeart: React.FC<ZeldaHeartProps> = ({ 
  size = 120
}) => {
  const pixelSize = size / 16;

  const Pixel = ({ row, col, color }: { row: number; col: number; color: string }) => (
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

  // Zelda heart colors
  const darkRed = '#C80000';
  const mainRed = '#FF0000';
  const lightRed = '#FF6060';
  const highlight = '#FFB0B0';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Row 2 - Top bumps outline */}
      <Pixel row={2} col={3} color={darkRed} />
      <Pixel row={2} col={4} color={darkRed} />
      <Pixel row={2} col={5} color={darkRed} />
      <Pixel row={2} col={10} color={darkRed} />
      <Pixel row={2} col={11} color={darkRed} />
      <Pixel row={2} col={12} color={darkRed} />

      {/* Row 3 - Top bumps with highlights */}
      <Pixel row={3} col={2} color={darkRed} />
      <Pixel row={3} col={3} color={highlight} />
      <Pixel row={3} col={4} color={highlight} />
      <Pixel row={3} col={5} color={lightRed} />
      <Pixel row={3} col={6} color={darkRed} />
      <Pixel row={3} col={9} color={darkRed} />
      <Pixel row={3} col={10} color={highlight} />
      <Pixel row={3} col={11} color={lightRed} />
      <Pixel row={3} col={12} color={lightRed} />
      <Pixel row={3} col={13} color={darkRed} />

      {/* Row 4 - Upper section */}
      <Pixel row={4} col={1} color={darkRed} />
      <Pixel row={4} col={2} color={highlight} />
      <Pixel row={4} col={3} color={highlight} />
      <Pixel row={4} col={4} color={lightRed} />
      <Pixel row={4} col={5} color={mainRed} />
      <Pixel row={4} col={6} color={mainRed} />
      <Pixel row={4} col={7} color={mainRed} />
      <Pixel row={4} col={8} color={mainRed} />
      <Pixel row={4} col={9} color={lightRed} />
      <Pixel row={4} col={10} color={lightRed} />
      <Pixel row={4} col={11} color={mainRed} />
      <Pixel row={4} col={12} color={mainRed} />
      <Pixel row={4} col={13} color={mainRed} />
      <Pixel row={4} col={14} color={darkRed} />

      {/* Row 5 - Middle upper */}
      <Pixel row={5} col={1} color={darkRed} />
      <Pixel row={5} col={2} color={highlight} />
      <Pixel row={5} col={3} color={lightRed} />
      <Pixel row={5} col={4} color={mainRed} />
      <Pixel row={5} col={5} color={mainRed} />
      <Pixel row={5} col={6} color={mainRed} />
      <Pixel row={5} col={7} color={mainRed} />
      <Pixel row={5} col={8} color={mainRed} />
      <Pixel row={5} col={9} color={mainRed} />
      <Pixel row={5} col={10} color={mainRed} />
      <Pixel row={5} col={11} color={mainRed} />
      <Pixel row={5} col={12} color={mainRed} />
      <Pixel row={5} col={13} color={mainRed} />
      <Pixel row={5} col={14} color={darkRed} />

      {/* Row 6 - Middle */}
      <Pixel row={6} col={1} color={darkRed} />
      <Pixel row={6} col={2} color={lightRed} />
      <Pixel row={6} col={3} color={mainRed} />
      <Pixel row={6} col={4} color={mainRed} />
      <Pixel row={6} col={5} color={mainRed} />
      <Pixel row={6} col={6} color={mainRed} />
      <Pixel row={6} col={7} color={mainRed} />
      <Pixel row={6} col={8} color={mainRed} />
      <Pixel row={6} col={9} color={mainRed} />
      <Pixel row={6} col={10} color={mainRed} />
      <Pixel row={6} col={11} color={mainRed} />
      <Pixel row={6} col={12} color={mainRed} />
      <Pixel row={6} col={13} color={mainRed} />
      <Pixel row={6} col={14} color={darkRed} />

      {/* Row 7 - Middle lower */}
      <Pixel row={7} col={2} color={darkRed} />
      <Pixel row={7} col={3} color={mainRed} />
      <Pixel row={7} col={4} color={mainRed} />
      <Pixel row={7} col={5} color={mainRed} />
      <Pixel row={7} col={6} color={mainRed} />
      <Pixel row={7} col={7} color={mainRed} />
      <Pixel row={7} col={8} color={mainRed} />
      <Pixel row={7} col={9} color={mainRed} />
      <Pixel row={7} col={10} color={mainRed} />
      <Pixel row={7} col={11} color={mainRed} />
      <Pixel row={7} col={12} color={mainRed} />
      <Pixel row={7} col={13} color={darkRed} />

      {/* Row 8 - Lower section */}
      <Pixel row={8} col={3} color={darkRed} />
      <Pixel row={8} col={4} color={mainRed} />
      <Pixel row={8} col={5} color={mainRed} />
      <Pixel row={8} col={6} color={mainRed} />
      <Pixel row={8} col={7} color={mainRed} />
      <Pixel row={8} col={8} color={mainRed} />
      <Pixel row={8} col={9} color={mainRed} />
      <Pixel row={8} col={10} color={mainRed} />
      <Pixel row={8} col={11} color={mainRed} />
      <Pixel row={8} col={12} color={darkRed} />

      {/* Row 9 - Lower narrowing */}
      <Pixel row={9} col={4} color={darkRed} />
      <Pixel row={9} col={5} color={mainRed} />
      <Pixel row={9} col={6} color={mainRed} />
      <Pixel row={9} col={7} color={mainRed} />
      <Pixel row={9} col={8} color={mainRed} />
      <Pixel row={9} col={9} color={mainRed} />
      <Pixel row={9} col={10} color={mainRed} />
      <Pixel row={9} col={11} color={darkRed} />

      {/* Row 10 - More narrowing */}
      <Pixel row={10} col={5} color={darkRed} />
      <Pixel row={10} col={6} color={mainRed} />
      <Pixel row={10} col={7} color={mainRed} />
      <Pixel row={10} col={8} color={mainRed} />
      <Pixel row={10} col={9} color={mainRed} />
      <Pixel row={10} col={10} color={darkRed} />

      {/* Row 11 - Near bottom */}
      <Pixel row={11} col={6} color={darkRed} />
      <Pixel row={11} col={7} color={mainRed} />
      <Pixel row={11} col={8} color={mainRed} />
      <Pixel row={11} col={9} color={darkRed} />

      {/* Row 12 - Bottom narrowing */}
      <Pixel row={12} col={7} color={darkRed} />
      <Pixel row={12} col={8} color={darkRed} />

      {/* Row 13 - Bottom point */}
      <Pixel row={13} col={7} color={darkRed} />
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
