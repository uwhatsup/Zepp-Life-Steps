import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  // 使用useRef初始化默认值，避免服务端渲染问题
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const particlesRef = useRef([]);
  const smallParticlesRef = useRef([]);
  const initialized = useRef(false);
  
  // 生成随机颜色
  const getRandomColor = (opacity = 1) => {
    const colors = [
      `rgba(99, 102, 241, ${opacity})`,   // primary
      `rgba(236, 72, 153, ${opacity})`,   // secondary
      `rgba(16, 185, 129, ${opacity})`,   // success
      `rgba(245, 158, 11, ${opacity})`,   // warning
      `rgba(59, 130, 246, ${opacity})`    // info
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // 生成粒子数据
  const generateParticles = (count, size) => {
    if (typeof window === 'undefined') return [];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height,
      size: Math.random() * size + 1,
      color: getRandomColor(0.6),
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 2
    }));
  };
  
  useEffect(() => {
    // 确保只在客户端执行
    if (typeof window === 'undefined' || initialized.current) return;
    
    // 设置窗口大小
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // 初始化粒子数据
    particlesRef.current = generateParticles(40, 4);
    smallParticlesRef.current = generateParticles(80, 2);
    initialized.current = true;
    
    // 处理鼠标移动
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // 处理窗口大小变化
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // 重新生成粒子适应新的窗口尺寸
      particlesRef.current = generateParticles(40, 4);
      smallParticlesRef.current = generateParticles(80, 2);
    };
    
    // 添加事件监听器
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // 组件卸载时清理事件监听器
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 生成主要形状和粒子
  const shapes = 6;
  
  // 检查是否在服务端渲染
  const isSSR = typeof window === 'undefined';
  
  return (
    <div className="background-container">
      {/* 主要形状 */}
      {[...Array(shapes)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className={`shape shape-${i + 1}`}
          animate={{
            x: [0, Math.sin(i * 60) * 100, Math.cos(i * 30) * -80, 0],
            y: [0, Math.cos(i * 45) * -100, Math.sin(i * 45) * 80, 0],
            scale: [1, 1 + Math.sin(i) * 0.2, 1 - Math.sin(i) * 0.1, 1],
            rotate: [0, i % 2 ? 180 : -180, i % 2 ? 360 : -360]
          }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: `linear-gradient(135deg, ${getRandomColor(0.4)}, ${getRandomColor(0.2)})`,
            filter: `blur(${Math.random() * 2 + 1}px)`,
            opacity: 0.6 - i * 0.05
          }}
        />
      ))}
      
      {!isSSR && initialized.current && (
        <>
          {/* 交互粒子 - 跟随鼠标移动 */}
          {particlesRef.current.map((particle) => (
            <motion.div
              key={`particle-${particle.id}`}
              className="particle"
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: [
                  particle.x,
                  particle.x + (mousePosition.x / windowSize.width * 50) - 25 + Math.random() * 30 - 15,
                  particle.x
                ],
                y: [
                  particle.y,
                  particle.y + (mousePosition.y / windowSize.height * 50) - 25 + Math.random() * 30 - 15,
                  particle.y
                ],
                opacity: [0, 0.8, 0],
                scale: [0, particle.size / 2, 0]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: particle.size,
                height: particle.size,
                borderRadius: '50%',
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                zIndex: 1
              }}
            />
          ))}
          
          {/* 小型背景粒子 */}
          {smallParticlesRef.current.map((particle) => (
            <motion.div
              key={`small-particle-${particle.id}`}
              className="small-particle"
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0
              }}
              animate={{
                x: [
                  particle.x,
                  particle.x + Math.random() * 100 - 50,
                  particle.x
                ],
                y: [
                  particle.y,
                  particle.y + Math.random() * 100 - 50,
                  particle.y
                ],
                opacity: [0, Math.random() * 0.4 + 0.1, 0]
              }}
              transition={{
                duration: particle.duration * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: particle.size / 2,
                height: particle.size / 2,
                borderRadius: '50%',
                background: particle.color,
                zIndex: 0
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Background; 