---
layout:	post
title:	Android自定义视图教程
categories:	android
tags:	android, view
---

Android的UI元素都是基于View(屏幕中单个元素)和ViewGroup(元素的集合),Android有许多自带的组件和布局，比如Button、TextView、RelativeLayout。在app开发过程中我们需要自定义视图组件来满足我们的需求。通过继承自View或者View的子类，覆写onDraw或者onTouchEvent等方法来覆盖视图的行为。

##创建完全自定义的组件

创建自定义的组件主要围绕着以下五个方面：

* 绘图(Drawing)： 控制视图的渲染，通常通过覆写onDraw方法来实现
* 交互(Interaction)： 控制用户和视图的交互方式，比如OnTouchEvent,gestures
* 尺寸(Measurement)： 控制视图内容的维度，通过覆写onMeasure方法
* 属性(Attributes)： 在XML中定义视图的属性，使用TypedArray来获取属性值
* 持久化(Persistence)： 配置发生改变时保存和恢复状态，通过onSaveInstanceState和onRestoreInstanceState

举个栗子，假设我们想创建一个图形允许用户点击的时候改变形状（方形、圆形、三角形）。如下所示：

![](/images/dag48.png)

###定义视图类

我们创建一个ShapeSelectorView继承自View，实现必要的构造器，如下所示：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  // We must provide a constructor that takes a Context and an AttributeSet.
	  // This constructor allows the UI to create and edit an instance of your view.
	  public ShapeSelectorView(Context context, AttributeSet attrs) {
		super(context, attrs);
	    }
	}
	{% endhighlight %}

###添加视图到布局中
	{% highlight XML %}
	<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    xmlns:app="http://schemas.android.com/apk/res-auto"
	    xmlns:tools="http://schemas.android.com/tools"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent" >
	    <com.codepath.example.customviewdemo.ShapeSelectorView
		android:id="@+id/shapeSelector"
		android:layout_width="match_parent"
		android:layout_height="match_parent"
		android:layout_alignParentRight="true"
		android:layout_alignParentTop="true"
		android:layout_alignParentLeft="true" />
	</RelativeLayout>
	{% endhighlight %}

接下来我们定义一个命名空间app,这个命名空间允许Android自动解析而不需要指定具体的包名。

###自定义属性

视图可以通过XML来配置属性和样式，你需要想清楚要添加那些自定义的属性，比如我们想让用户可以选择形状的颜色、是否显示形状的名称，比如我们想让视图可以像下面一样配置：

	{% highlight XML %}
	<com.codepath.example.customviewdemo.ShapeSelectorView
	    app:shapeColor="#7f0000"
	    app:displayShapeName="true"
	    android:id="@+id/shapeSelector"
	    ... />
	{% endhighlight %}


为了能够定义shapeColor和displayShapeName,我们需要在res/values/attrs.xml中配置：

	{% highlight XML %}
	<?xml version="1.0" encoding="utf-8"?>
	<resources>
	   <declare-styleable name="ShapeSelectorView">
	       <attr name="shapeColor" format="color" />
	       <attr name="displayShapeName" format="boolean" />
	   </declare-styleable>
	</resources>
	{% endhighlight %}

对于每个你想自定义的属性你需要定义attr节点，每个节点有name和format属性，format属性是我们期望的值的类型，比如color,dimension,boolean,integer,float等。一旦定义好了属性，你可以像使用自带属性一样使用他们，唯一的区别在于你的自定义属性属于一个不同的命名空间，你可以在根视图的layout里面定义命名空间，一般情况下你只需要这样子指定：`http://schemas.android.com/apk/res/<package_name>`,但是你可以使用`http://schemas.android.com/apk/res-auto`自动解析命名空间。
	{% highlight XML %}
	<?xml version="1.0" encoding="utf-8"?>
	<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    xmlns:tools="http://schemas.android.com/tools"
	    xmlns:app="http://schemas.android.com/apk/res-auto"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent" >
	    <com.codepath.example.customviewdemo.ShapeSelectorView
		   app:shapeColor="#7f0000"
		   app:displayShapeName="true"
		   android:id="@+id/shapeSelector"
		   android:layout_width="wrap_content"
		   android:layout_height="wrap_content"
		   android:layout_above="@+id/btnSelect"
		   android:layout_alignParentLeft="true"
		   android:layout_below="@+id/tvPrompt" />
	</RelativeLayout>
	{% endhighlight %}

###应用自定义属性

在前面我们定义了shapeColor和displayShapeName两个属性值，我们需要提取这两个属性值来用在自定义的视图中，可以使用TypedArray和obtainStyledAttributes方法来完成，如下所示：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  private int shapeColor;
	  private boolean displayShapeName;

	  public ShapeSelectorView(Context context, AttributeSet attrs) {
	    super(context, attrs);
	    setupAttributes(attrs);
	  }

	  private void setupAttributes(AttributeSet attrs) {
	    // Obtain a typed array of attributes
	    TypedArray a = getContext().getTheme().obtainStyledAttributes(attrs, R.styleable.ShapeSelectorView, 0, 0);
	    // Extract custom attributes into member variables
	    try {
	      shapeColor = a.getColor(R.styleable.ShapeSelectorView_shapeColor, Color.BLACK);
	      displayShapeName = a.getBoolean(R.styleable.ShapeSelectorView_displayShapeName, false);
	    } finally {
	      // TypedArray objects are shared and must be recycled.
	      a.recycle();
	    }
	  }
	}
	{% endhighlight %}

接下来添加一些getter和setter方法：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  // ...
	  public boolean isDisplayingShapeName() {
	    return displayShapeName;
	  }

	  public void setDisplayingShapeName(boolean state) {
	    this.displayShapeName = state;
	    invalidate();
	    requestLayout();
	  }

	  public int getShapeColor() {
	    return shapeColor;
	  }

	  public void setShapeColor(int color) {
	    this.shapeColor = color;
	    invalidate();
	    requestLayout();
	  }
	}
	{% endhighlight %}

当视图属性发生改变的时候可能需要重新绘图，你需要调用invalidate()和requestLayout()来刷新显示。

###画图

假设我们要使用前面的属性画一个长方形，所有的绘图都是在onDraw方法里执行，使用Canvas对象来绘图，如下所示：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  // ...
	  private int shapeWidth = 100;
	  private int shapeHeight = 100;
	  private int textXOffset = 0;
	  private int textYOffset = 30;
	  private Paint paintShape;

	  // ...
	  public ShapeSelectorView(Context context, AttributeSet attrs) {
	    super(context, attrs);
	    setupAttributes(attrs);
	    setupPaint();
	  }

	  @Override
	  protected void onDraw(Canvas canvas) {
	    super.onDraw(canvas);
	    canvas.drawRect(0, 0, shapeWidth, shapeHeight, paintShape);
	    if (displayShapeName) {
	      canvas.drawText("Square", shapeWidth + textXOffset, shapeHeight + textXOffset, paintShape);
	    }
	  }

	  private void setupPaint() { 
	      paintShape = new Paint();
	      paintShape.setStyle(Style.FILL);
	      paintShape.setColor(shapeColor);
	      paintShape.setTextSize(30);
	   }
	}
	{% endhighlight %}

这段代码就会根据XML里设置的shapeColor来画图，根据displayShapeName属性来决定是否显示图形的名称，结果如下图：

![](/images/dag49.png)

更多画图的教程可以参考这里[ Custom 2D Drawing Tutorial](http://developer.android.com/guide/topics/graphics/2d-graphics.html)

###计算尺寸

为了更好的理解自定义视图的宽度和高度，我们需要定义onMeasure方法，这个方法根据视图的内容来决定它的宽度和高度，在这里宽度和高度是由形状和下面的文本决定的，如下所示：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  @Override
	  protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
	    // Defines the extra padding for the shape name text
	    int textPadding = 10;
	    int contentWidth = shapeWidth;
	    
	    // Resolve the width based on our minimum and the measure spec
	    int minw = contentWidth + getPaddingLeft() + getPaddingRight();
	    int w = resolveSizeAndState(minw, widthMeasureSpec, 0);
	    
	    // Ask for a height that would let the view get as big as it can
	    int minh = shapeHeight + getPaddingBottom() + getPaddingTop();
	    if (displayShapeName) { 
		minh += textYOffset + textPadding;
	    }
	    int h = resolveSizeAndState(minh, heightMeasureSpec, 0);
	    
	    // Calling this method determines the measured width and height
	    // Retrieve with getMeasuredWidth or getMeasuredHeight methods later
	    setMeasuredDimension(w, h);
	  }
	}
	{% endhighlight %}

宽度和高度都是基于MeasureSpec来讨论的，一个MeasureSpec封装了父布局传递给子布局的布局要求，每个MeasureSpec代表了一组宽度和高度的要求。一个MeasureSpec由大小和模式组成。它有三种模式：UNSPECIFIED(未指定),父元素未给子元素施加任何束缚，子元素可以得到任意想要的大小；EXACTLY(完全)，父元素决定子元素的确切大小，子元素将被限定在给定的边界里而忽略它本身大小；AT_MOST(至多)，子元素至多达到指定大小的值。resolveSizeAndState()方法根据视图想要的大小和MeasureSpec返回一个合适的值，最后你需要调用setMeasureDimension()方法生效。

###不同形状之间切换

如果想实现用户点击之后改变形状，需要在onTouchEvent方法里添加自定义逻辑：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  // ...
	  private String[] shapeValues = { "square", "circle", "triangle" };
	  private int currentShapeIndex = 0;

	  // Change the currentShapeIndex whenever the shape is clicked
	  @Override
	  public boolean onTouchEvent(MotionEvent event) {
	    boolean result = super.onTouchEvent(event);
	    if (event.getAction() == MotionEvent.ACTION_DOWN) {
	      currentShapeIndex ++;
	      if (currentShapeIndex > (shapeValues.length - 1)) {
		currentShapeIndex = 0;
	      }
	      postInvalidate();
	      return true;
	    }
	    return result;
	  }
	}
	{% endhighlight %}

现在不管什么时候视图被单击，选择的形状的下标会改变，调用postInvalisate()方法后会显示一个不同的形状，接下来更新onDraw()方法来实现更改形状的逻辑：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  // ...

	  @Override
	  protected void onDraw(Canvas canvas) {
	    super.onDraw(canvas);
	    String shapeSelected = shapeValues[currentShapeIndex];
	    if (shapeSelected.equals("square")) {
	      canvas.drawRect(0, 0, shapeWidth, shapeHeight, paintShape);
	      textXOffset = 0;
	    } else if (shapeSelected.equals("circle")) {
	      canvas.drawCircle(shapeWidth / 2, shapeHeight / 2, shapeWidth / 2, paintShape);
	      textXOffset = 12;
	    } else if (shapeSelected.equals("triangle")) {
	      canvas.drawPath(getTrianglePath(), paintShape);
	      textXOffset = 0;
	    }
	    if (displayShapeName) {
	      canvas.drawText(shapeSelected, 0 + textXOffset, shapeHeight + textYOffset, paintShape);
	    }
	  }

	  protected Path getTrianglePath() {
	    Point p1 = new Point(0, shapeHeight), p2 = null, p3 = null;
	    p2 = new Point(p1.x + shapeWidth, p1.y);
	    p3 = new Point(p1.x + (shapeWidth / 2), p1.y - shapeHeight);
	    Path path = new Path();
	    path.moveTo(p1.x, p1.y);
	    path.lineTo(p2.x, p2.y);
	    path.lineTo(p3.x, p3.y);
	    return path;
	  }

	  // ...
	}
	{% endhighlight %}

现在每次点击都会显示一个不同的形状，结果如下：

![](/images/dag50.png)


接下来添加一个获取形状的方法：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  // ...
	  // Returns selected shape name
	  public String getSelectedShape() {
	    return shapeValues[currentShapeIndex];
	  }
	}
	{% endhighlight %}

###保存视图的状态

当配置发生改变的时候(比如屏幕旋转)视图需要保存它们的状态，你可以实现onSaveInstanceState()和onRestoreInstanceState()方法来保存和恢复视图状态，如下所示：

	{% highlight java %}
	public class ShapeSelectorView extends View {
	  // This is the view state for this shape selector
	  private int currentShapeIndex = 0;

	  @Override
	  public Parcelable onSaveInstanceState() {
	    // Construct bundle
	    Bundle bundle = new Bundle();
	    // Store base view state
	    bundle.putParcelable("instanceState", super.onSaveInstanceState());
	    // Save our custom view state to bundle
	    bundle.putInt("currentShapeIndex", this.currentShapeIndex);
	    // ... store any other custom state here ...
	    // Return the bundle
	    return bundle;
	  }

	  @Override
	  public void onRestoreInstanceState(Parcelable state) {
	    // Checks if the state is the bundle we saved
	    if (state instanceof Bundle) {
	      Bundle bundle = (Bundle) state;
	      // Load back our custom view state
	      this.currentShapeIndex = bundle.getInt("currentShapeIndex");
	      // ... load any other custom state here ...
	      // Load base view state back
	      state = bundle.getParcelable("instanceState");
	    }
	    // Pass base view state on to super
	    super.onRestoreInstanceState(state);
	  }
	}
	{% endhighlight %}

一旦你实现了这些保存和恢复的逻辑，当手机配置改变的时候你的视图能够自动保存状态。


































	















