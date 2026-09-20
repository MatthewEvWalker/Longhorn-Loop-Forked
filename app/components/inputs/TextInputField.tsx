import LhlPillCross from '@/assets/icons/LhlPillCross';
import { useThemeColors } from '@/app/lib/themeColors';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

interface TextInputFieldProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  clearable?: boolean;
  borderRadius?: number; // px
  forceFocusStyles?: boolean;
}

export default function TextInputField({
  label,
  leftIcon,
  clearable,
  borderRadius = 4,
  forceFocusStyles = false,
  ...props
}: TextInputFieldProps) {
  const colors = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  // ReturnType<typeof setTimeout>, not NodeJS.Timeout: RN's types no longer
  // pull in Node's globals (Expo SDK 57), and the handle here is whatever the
  // RN runtime's setTimeout returns — a number on Hermes — not a Node Timeout.
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A blur schedules a 100ms timer so handleClear() can still fire. If the
  // field unmounts inside that window the timer is still pending and will call
  // setState on a dead component. Harmless in React 19, but it keeps the
  // component alive for no reason and hides real leaks, so clear it.
  useEffect(
    () => () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    },
    [],
  );

  // --- HANDLERS ---
  const handleFocus = (e: any) => {
    // Prevents timedout blur operation if focus is called
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    // Timeout to allow handleClear() call
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      blurTimeoutRef.current = null;
    }, 100);

    props.onBlur?.(e);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleClear = () => {
    // Clears text and refocuses text input
    props.onChangeText?.('');
    focusInput();
  };

  // --- DERIVED VALUES ---
  const borderColorClass =
    isFocused || forceFocusStyles ? 'border-lhlBurntOrange' : 'border-lhlBorderColor';

  // --- RENDER: TEXT INPUT FIELD ---
  return (
    <View>
      {/* LABEL */}
      {/* Label is 600; the input below stays regular. */}
      {label && (
        <Pressable onPress={focusInput}>
          <Text className="font-roboto-semibold text-[16px] text-lhlInk">{label}</Text>
        </Pressable>
      )}

      {/* INPUT CONTAINER */}
      <Pressable
        onPress={focusInput}
        className={`
          mt-[6px]
          flex-row items-center
          border
          px-[9px] h-[33px] gap-2
          ${borderColorClass}
          bg-lhlSurface
        `}
        style={{
          borderRadius: borderRadius,
        }}
      >
        {/* Left Icon */}
        {leftIcon && <View>{leftIcon}</View>}

        {/* Text Input */}
        {/*
          text-lhlInk is load-bearing: without an explicit colour the platform
          default is black, which is invisible against the dark-mode surface.
          That was the "dark mode is not working" report on every search field.
        */}
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          accessibilityRole="text"
          className={`
            flex-1 font-['Roboto-Flex'] text-[14px] text-lhlInk
            focus:ring-0 focus:outline-none
            placeholder:text-lhlMutedText
          `}
          underlineColorAndroid="transparent"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
          /*
            WHY THE TEXT SAT OFF-CENTRE, and why three properties are needed
            rather than one.

            The row is 33pt with `items-center`, so the input is centred by the
            layout — but a TextInput is not just its text. It ships with its own
            padding, and on Android with extra font padding on top of that, and
            neither is symmetric. Centring a box that has 9pt of built-in top
            padding and 4pt of bottom padding centres the BOX, which leaves the
            glyphs sitting low.

              padding: 0            drops RN's built-in inset on both platforms
              includeFontPadding    Android's extra ascender/descender space,
                                    which is what makes text look high in a
                                    short field
              textAlignVertical     Android defaults this to 'top' for a
                                    single-line input in some configurations

            height 100% so the input fills the row and centres its own text
            inside it, rather than being a short box centred in a taller one.

            Last, after the spread, so these are not silently dropped by a
            caller passing `style` — the caller's own style is merged in rather
            than replaced.
          */
          style={[
            {
              height: '100%',
              padding: 0,
              includeFontPadding: false,
              textAlignVertical: 'center',
            },
            props.style,
          ]}
        />
        {/* Clear Button */}
        {/*
          Bare cross, not LhlXCircleIcon. The circled variant was never in the
          Figma and the bug bash called it out explicitly. Colour comes from the
          theme so it survives dark mode.
        */}
        {clearable && (isFocused || forceFocusStyles) && (
          <Pressable
            onPressIn={(e) => e.preventDefault?.()}
            onPress={handleClear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear text"
          >
            <LhlPillCross size={11} color={colors.inkSecondary} />
          </Pressable>
        )}
      </Pressable>
    </View>
  );
}
