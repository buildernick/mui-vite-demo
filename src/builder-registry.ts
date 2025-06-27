"use client";
import { builder, Builder, withChildren } from "@builder.io/react";
import { brand, gray, green, orange, red, typography, shape, shadows } from './shared-theme/themePrimitives';

builder.init(import.meta.env.VITE_BUILDER_API_KEY);

Builder.register("editor.settings", {
  styleStrictMode: false,
  allowOverridingTokens: true, // optional
  designTokens: {
    colors: [
      // Brand colors
      { name: "Brand 50", value: brand[50] },
      { name: "Brand 100", value: brand[100] },
      { name: "Brand 200", value: brand[200] },
      { name: "Brand 300", value: brand[300] },
      { name: "Brand 400", value: brand[400] },
      { name: "Brand 500", value: brand[500] },
      { name: "Brand 600", value: brand[600] },
      { name: "Brand 700", value: brand[700] },
      { name: "Brand 800", value: brand[800] },
      { name: "Brand 900", value: brand[900] },
      
      // Gray colors
      { name: "Gray 50", value: gray[50] },
      { name: "Gray 100", value: gray[100] },
      { name: "Gray 200", value: gray[200] },
      { name: "Gray 300", value: gray[300] },
      { name: "Gray 400", value: gray[400] },
      { name: "Gray 500", value: gray[500] },
      { name: "Gray 600", value: gray[600] },
      { name: "Gray 700", value: gray[700] },
      { name: "Gray 800", value: gray[800] },
      { name: "Gray 900", value: gray[900] },
      
      // Green colors
      { name: "Green 50", value: green[50] },
      { name: "Green 100", value: green[100] },
      { name: "Green 200", value: green[200] },
      { name: "Green 300", value: green[300] },
      { name: "Green 400", value: green[400] },
      { name: "Green 500", value: green[500] },
      { name: "Green 600", value: green[600] },
      { name: "Green 700", value: green[700] },
      { name: "Green 800", value: green[800] },
      { name: "Green 900", value: green[900] },
      
      // Orange colors
      { name: "Orange 50", value: orange[50] },
      { name: "Orange 100", value: orange[100] },
      { name: "Orange 200", value: orange[200] },
      { name: "Orange 300", value: orange[300] },
      { name: "Orange 400", value: orange[400] },
      { name: "Orange 500", value: orange[500] },
      { name: "Orange 600", value: orange[600] },
      { name: "Orange 700", value: orange[700] },
      { name: "Orange 800", value: orange[800] },
      { name: "Orange 900", value: orange[900] },
      
      // Red colors
      { name: "Red 50", value: red[50] },
      { name: "Red 100", value: red[100] },
      { name: "Red 200", value: red[200] },
      { name: "Red 300", value: red[300] },
      { name: "Red 400", value: red[400] },
      { name: "Red 500", value: red[500] },
      { name: "Red 600", value: red[600] },
      { name: "Red 700", value: red[700] },
      { name: "Red 800", value: red[800] },
      { name: "Red 900", value: red[900] },
      
      // Semantic colors
      { name: "Primary", value: brand[400] },
      { name: "Primary Light", value: brand[200] },
      { name: "Primary Dark", value: brand[700] },
      { name: "Secondary", value: gray[600] },
      { name: "Success", value: green[400] },
      { name: "Warning", value: orange[400] },
      { name: "Error", value: red[400] },
      { name: "Info", value: brand[300] },
      
      // Background colors
      { name: "Background Default", value: "hsl(0, 0%, 99%)" },
      { name: "Background Paper", value: "hsl(220, 35%, 97%)" },
      { name: "Background Dark", value: gray[900] },
      { name: "Background Dark Paper", value: "hsl(220, 30%, 7%)" },
      
      // Text colors
      { name: "Text Primary", value: gray[800] },
      { name: "Text Secondary", value: gray[600] },
      { name: "Text Primary Dark", value: "hsl(0, 0%, 100%)" },
      { name: "Text Secondary Dark", value: gray[400] },
    ],
    spacing: [
      { name: "XS", value: "4px" },
      { name: "SM", value: "8px" },
      { name: "MD", value: "16px" },
      { name: "LG", value: "24px" },
      { name: "XL", value: "32px" },
      { name: "XXL", value: "48px" },
      { name: "XXXL", value: "64px" },
    ],
    fontFamily: [
      { name: "Inter", value: typography.fontFamily }
    ],
    fontSize: [
      { name: "H1", value: typography.h1.fontSize },
      { name: "H2", value: typography.h2.fontSize },
      { name: "H3", value: typography.h3.fontSize },
      { name: "H4", value: typography.h4.fontSize },
      { name: "H5", value: typography.h5.fontSize },
      { name: "H6", value: typography.h6.fontSize },
      { name: "Subtitle 1", value: typography.subtitle1.fontSize },
      { name: "Subtitle 2", value: typography.subtitle2.fontSize },
      { name: "Body 1", value: typography.body1.fontSize },
      { name: "Body 2", value: typography.body2.fontSize },
      { name: "Caption", value: typography.caption.fontSize },
    ],
    fontWeight: [
      { name: "Light", value: "300" },
      { name: "Regular", value: "400" },
      { name: "Medium", value: "500" },
      { name: "Semi Bold", value: "600" },
      { name: "Bold", value: "700" },
    ],
    letterSpacing: [
      { name: "Tight", value: "-0.5px" },
      { name: "Normal", value: "0px" },
      { name: "Wide", value: "0.5px" },
    ],
    lineHeight: [
      { name: "Tight", value: "1.2" },
      { name: "Normal", value: "1.5" },
      { name: "Relaxed", value: "1.8" },
    ],
    borderRadius: [
      { name: "SM", value: "4px" },
      { name: "MD", value: shape.borderRadius + "px" },
      { name: "LG", value: "12px" },
      { name: "XL", value: "16px" },
      { name: "Round", value: "50%" },
    ],
    boxShadow: [
      { name: "None", value: shadows[0] },
      { name: "Small", value: shadows[1] },
      { name: "Medium", value: shadows[2] },
      { name: "Large", value: shadows[3] },
      { name: "XL", value: shadows[4] },
      { name: "2XL", value: shadows[5] },
    ],
  },
});