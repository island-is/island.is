import React, { useEffect, useRef, useState } from 'react'
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useTheme } from 'styled-components/native'
import { useStore } from 'zustand'

import { Typography } from '../ui'
import { promptStore } from './prompt-store'

export function PromptModal() {
  const theme = useTheme()
  const { visible, options, resolve, hide } = useStore(promptStore)
  const [text, setText] = useState('')
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (visible) {
      setText(options?.defaultValue ?? '')
      // Small delay so the modal is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [visible, options?.defaultValue])

  if (!options) {
    return null
  }

  const handlePositive = () => {
    resolve?.({ action: 'positive', text })
    hide()
  }

  const handleNegative = () => {
    resolve?.({ action: 'negative' })
    hide()
  }

  const handleDismiss = () => {
    resolve?.({ action: 'dismiss' })
    hide()
  }

  const positiveText = options.positiveText ?? 'OK'
  const negativeText = options.negativeText ?? 'Cancel'

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dialog,
                { backgroundColor: theme.shade.background },
              ]}
            >
              <View style={styles.content}>
                <Typography
                  variant="heading4"
                  style={styles.title}
                >
                  {options.title}
                </Typography>
                {options.message ? (
                  <Typography variant="body3" style={styles.message}>
                    {options.message}
                  </Typography>
                ) : null}
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.input,
                    {
                      color: theme.shade.foreground,
                      borderColor: theme.color.blue400,
                      backgroundColor: theme.shade.background,
                    },
                  ]}
                  value={text}
                  onChangeText={setText}
                  keyboardType={options.keyboardType ?? 'default'}
                  placeholder={options.placeholder}
                  placeholderTextColor={theme.color.dark300}
                  returnKeyType="done"
                  onSubmitEditing={handlePositive}
                  autoCorrect={false}
                />
              </View>
              <View
                style={[
                  styles.buttonRow,
                  { borderTopColor: theme.color.dark200 },
                ]}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleNegative}
                >
                  <Typography
                    variant="body"
                    style={{ color: theme.color.dark400 }}
                  >
                    {negativeText}
                  </Typography>
                </TouchableOpacity>
                <View
                  style={[
                    styles.buttonDivider,
                    { backgroundColor: theme.color.dark200 },
                  ]}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handlePositive}
                >
                  <Typography
                    variant="body"
                    style={{ color: theme.color.blue400, fontWeight: '600' }}
                  >
                    {positiveText}
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
    gap: 8,
  },
  title: {
    marginBottom: 4,
  },
  message: {
    marginBottom: 4,
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDivider: {
    width: StyleSheet.hairlineWidth,
  },
})
