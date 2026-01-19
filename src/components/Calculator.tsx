import React, { useEffect, useMemo, useState } from "react";
import { sendResultEmail } from "../services/mailService";

import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BlurView } from "expo-blur";
import { create, all } from "mathjs";
import { Delete, History, Sparkles } from "lucide-react-native";

import Button from "./Button";
import Display from "./Display";
import HistoryDrawer from "./HistoryDrawer";
import { solveMathWithAI } from "../services/geminiService";
import type { CalculatorButton } from "../types";

const math = create(all);

export default function Calculator() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [isAiMode, setIsAiMode] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiExplanation, setAiExplanation] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    const ops = useMemo(() => ["+", "-", "×", "÷", "%"], []);

    const addToHistory = (entry: string) => setHistory((prev) => [entry, ...prev].slice(0, 10));

    const toggleAiMode = () => {
        setIsAiMode((v) => !v);
        setInput("");
        setResult("");
        setAiExplanation("");
    };

    const calculateResult = async () => {
        try {
            if (!input) return;
            const expression = input.replace(/×/g, "*").replace(/÷/g, "/");
            const calculated = math.evaluate(expression);
            const formatted = math.format(calculated, { precision: 14 });
            const formattedStr = String(formatted);

            setResult(formattedStr);
            addToHistory(`${input} = ${formattedStr}`);

            // gửi mail ngay khi bấm "=" (standard)
            await sendResultEmail({
                expression: input,
                result: formattedStr,
                mode: "STANDARD",
            });
        } catch {
            setResult("Error");
        }
    };


    const handleAiSolve = async () => {
        if (!input) return;
        setAiLoading(true);
        setAiExplanation("Đang suy nghĩ...");
        try {
            const { answer, explanation } = await solveMathWithAI(input);
            setResult(answer);
            setAiExplanation(explanation);
            addToHistory(`AI: ${input} = ${answer}`);

            await sendResultEmail({
                expression: input,
                result: answer,
                mode: "AI",
            });
        } catch {
            setResult("Error");
            setAiExplanation("Lỗi kết nối AI");
        } finally {
            setAiLoading(false);
        }
    };


    const handlePress = async (value: string) => {
        const isOperator = ops.includes(value);

        // nếu đang có result:
        if (result && value !== "AC" && value !== "DEL" && value !== "=" && value !== "AI" && !isOperator) {
            setInput(value);
            setResult("");
            setAiExplanation("");
            return;
        }
        if (result && isOperator) {
            setInput(result + value);
            setResult("");
            setAiExplanation("");
            return;
        }

        if (value === "AI") return toggleAiMode();
        if (isAiMode && value === "=") return handleAiSolve();

        switch (value) {
            case "AC":
                setInput("");
                setResult("");
                setAiExplanation("");
                break;
            case "DEL":
                setInput((prev) => prev.slice(0, -1));
                break;
            case "=":
                calculateResult();
                break;
            default:
                setInput((prev) => prev + value);
        }
    };

    // Keyboard support (web)
    useEffect(() => {
        if (Platform.OS !== "web") return;

        const onKeyDown = (e: KeyboardEvent) => {
            const el = e.target as HTMLElement | null;
            if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;

            const key = e.key;

            if (/[0-9]/.test(key)) handlePress(key);
            if (["+", "-", "*", "/", "%", ".", "(", ")"].includes(key)) {
                if (key === "*") handlePress("×");
                else if (key === "/") handlePress("÷");
                else handlePress(key);
            }
            if (key === "Enter") (isAiMode ? handleAiSolve() : calculateResult());
            if (key === "Backspace") handlePress("DEL");
            if (key === "Escape") handlePress("AC");
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [input, result, isAiMode]);

    const buttons: CalculatorButton[] = [
        { label: "C", value: "AC", variant: "danger" },
        { label: "(", value: "(", variant: "function" },
        { label: ")", value: ")", variant: "function" },
        { label: "÷", value: "÷", variant: "operator" },

        { label: "7", value: "7", variant: "default" },
        { label: "8", value: "8", variant: "default" },
        { label: "9", value: "9", variant: "default" },
        { label: "×", value: "×", variant: "operator" },

        { label: "4", value: "4", variant: "default" },
        { label: "5", value: "5", variant: "default" },
        { label: "6", value: "6", variant: "default" },
        { label: "-", value: "-", variant: "operator" },

        { label: "1", value: "1", variant: "default" },
        { label: "2", value: "2", variant: "default" },
        { label: "3", value: "3", variant: "default" },
        { label: "+", value: "+", variant: "operator" },

        { label: "0", value: "0", variant: "default" },
        { label: ".", value: ".", variant: "default" },
        { label: "=", value: "=", variant: "action", colSpan: 2 },
    ];

    const headerAiBtnStyle = isAiMode ? styles.headerBtnActive : styles.headerBtn;

    return (
        <View style={styles.shell}>
            <View style={styles.glassCard}>
                <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />

                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={toggleAiMode} style={headerAiBtnStyle}>
                        <Sparkles color={isAiMode ? "rgba(216,180,254,1)" : "rgba(255,255,255,0.45)"} size={20} />
                    </Pressable>

                    <Text style={styles.brand}>LUMINA CALC</Text>

                    <Pressable onPress={() => setShowHistory(true)} style={styles.headerBtn}>
                        <History color="rgba(255,255,255,0.45)" size={20} />
                    </Pressable>
                </View>

                <Display input={input} result={result} aiExplanation={aiExplanation} isAiMode={isAiMode} />

                {/* AI input */}
                {isAiMode && (
                    <View style={{ marginBottom: 14 }}>
                        <TextInput
                            value={input}
                            onChangeText={(t) => {
                                setInput(t);
                                setResult("");
                                setAiExplanation("");
                            }}
                            placeholder="Nhập bài toán (vd: căn bậc 2 của 144...)"
                            placeholderTextColor="rgba(255,255,255,0.30)"
                            style={styles.aiInput}
                            autoCorrect={false}
                            autoCapitalize="none"
                        />
                    </View>
                )}

                {/* Keypad */}
                <View style={styles.grid}>
                    {isAiMode ? (
                        <>
                            {buttons
                                .filter((b) => b.value !== "AC")
                                .map((btn, idx) => (
                                    <Button
                                        key={idx}
                                        label={btn.value === "=" ? <Sparkles size={22} color="white" /> : btn.label}
                                        onClick={() => handlePress(btn.value)}
                                        variant={btn.variant}
                                        colSpan={btn.colSpan}
                                        disabled={btn.value === "=" && aiLoading}
                                    />
                                ))}
                            <Button label="Clear" onClick={() => handlePress("AC")} variant="danger" colSpan={1} />
                        </>
                    ) : (
                        buttons.map((btn, idx) => (
                            <Button
                                key={idx}
                                label={btn.label === "C" ? <Delete size={22} color="rgba(248,113,113,0.95)" /> : btn.label}
                                onClick={() => handlePress(btn.value)}
                                variant={btn.variant}
                                colSpan={btn.colSpan}
                            />
                        ))
                    )}
                </View>
            </View>

            <HistoryDrawer
                visible={showHistory}
                onClose={() => setShowHistory(false)}
                history={history}
                onClear={() => setHistory([])}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    shell: { width: "100%", maxWidth: 420, alignSelf: "center" },

    glassCard: {
        borderRadius: 48,
        padding: 18,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
        overflow: "hidden",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
        paddingHorizontal: 6,
    },
    brand: { color: "rgba(255,255,255,0.50)", fontWeight: "900", letterSpacing: 2.5, fontSize: 12 },

    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.06)",
    },
    headerBtnActive: {
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(168,85,247,0.20)",
        borderWidth: 1,
        borderColor: "rgba(168,85,247,0.18)",
    },

    aiInput: {
        width: "100%",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "white",
        backgroundColor: "rgba(0,0,0,0.30)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
        fontSize: 14,
    },

    grid: { flexDirection: "row", flexWrap: "wrap" },
});
